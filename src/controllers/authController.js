const createLogger = require('../utils/logger');
const userService = require('../services/userService');
const config = require('../config');
const azureAdService = require('../services/azureAdService');

const logger = createLogger('auth-controller');

const showLogin = (req, res) => {
  res.locals.pageTitle = 'Sign in';
  if (typeof res.locals.addScript === 'function') {
    res.locals.addScript('/js/login.js');
  }
  delete req.session.azureAuth;
  res.render('auth/login', { layout: 'layouts/landing' });
};

const startAzureLogin = async (req, res) => {
  const allowedRoles = ['reviewer', 'productOwner', 'admin'];
  const requestedRole = req.query.role;
  const role = allowedRoles.includes(requestedRole) ? requestedRole : 'reviewer';

  try {
    const state = azureAdService.generateState();
    req.session.azureAuth = { state, role };

    const authUrl = await azureAdService.getAuthCodeUrl({ state });
    return res.redirect(authUrl);
  } catch (error) {
    logger.error('Failed to initiate Azure AD login', { error: error.message });
    req.flash('error', 'Unable to start sign in with Microsoft right now. Please try again later.');
    return res.redirect('/login');
  }
};

const handleAzureCallback = async (req, res) => {
  const { error, error_description: errorDescription, state, code } = req.query;
  const sessionState = req.session.azureAuth;

  if (error) {
    logger.error('Azure AD returned an error', { error, errorDescription });
    delete req.session.azureAuth;
    req.flash('error', 'Microsoft sign in failed. Please try again.');
    return res.redirect('/login');
  }

  if (!sessionState || !state || state !== sessionState.state) {
    logger.warn('Azure AD state mismatch or missing session information');
    delete req.session.azureAuth;
    req.flash('error', 'Your sign-in session expired. Start again.');
    return res.redirect('/login');
  }

  if (!code) {
    delete req.session.azureAuth;
    req.flash('error', 'Missing authorization code. Start again.');
    return res.redirect('/login');
  }

  try {
    const tokenResponse = await azureAdService.acquireTokenByCode({ code });
    const claims = tokenResponse?.idTokenClaims;

    if (!claims) {
      throw new Error('Missing ID token claims');
    }

    if (claims.tid && claims.tid !== config.azureAd.tenantId) {
      throw new Error('Token issued for unexpected tenant');
    }

    const email = String(claims.preferred_username || claims.email || '').toLowerCase();
    if (!email) {
      throw new Error('No email claim returned');
    }

    const user = await userService.ensureUser(email);
    req.session.user = {
      ...userService.serializeForSession(user),
      role: sessionState.role,
      name: claims.name || user.email,
      oid: claims.oid || claims.sub,
      team: config.azureAd.teamName
    };
    req.session.lastLoginAt = new Date().toISOString();
    delete req.session.azureAuth;
    req.flash('success', 'Signed in successfully.');
    return res.redirect('/dashboard');
  } catch (err) {
    logger.error('Failed to complete Azure AD sign in', { error: err.message });
    delete req.session.azureAuth;
    req.flash('error', 'We could not verify your Microsoft sign in. Try again.');
    return res.redirect('/login');
  }
};

const login = (req, res) => {
  const allowedRoles = ['reviewer', 'productOwner', 'admin'];
  const requestedRole = req.body?.role;
  const role = allowedRoles.includes(requestedRole) ? requestedRole : 'reviewer';
  return res.redirect(`/auth/azure/start?role=${encodeURIComponent(role)}`);
};

const logout = (req, res, next) => {
  // Regenerate the session to log out safely and still allow flash messaging
  req.session.regenerate((err) => {
    if (err) {
      logger.error('Failed to regenerate session on logout', { error: err.message });
      return next(err);
    }
    req.flash('info', 'Signed out successfully.');
    return res.redirect('/login');
  });
};

module.exports = {
  showLogin,
  startAzureLogin,
  handleAzureCallback,
  login,
  logout
};
