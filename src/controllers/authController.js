const createLogger = require('../utils/logger');
const userService = require('../services/userService');
const mfaService = require('../services/mfaService');
const config = require('../config');

const logger = createLogger('auth-controller');

const showLogin = (req, res) => {
  res.locals.pageTitle = 'Sign in';
};

const login = async (req, res) => {
  const createLogger = require('../utils/logger');
  const userService = require('../services/userService');
  const mfaService = require('../services/mfaService');
  const config = require('../config');

  const logger = createLogger('auth-controller');

  const showLogin = (req, res) => {
    res.locals.pageTitle = 'Sign in';
    res.render('auth/login', { layout: 'layouts/landing' });
  };

  const login = async (req, res) => {
    const { email = '', role: rawRole } = req.body;

    if (!email) {
      req.flash('error', 'Email is required.');
      return res.redirect('/login');
    }

    // Passwordless: ensure user exists and sign in immediately (no MFA)
    const normalizedEmail = String(email).trim().toLowerCase();
    const allowedRoles = ['reviewer', 'productOwner', 'admin'];
    const role = allowedRoles.includes(rawRole) ? rawRole : 'reviewer';
    const user = await userService.ensureUser(normalizedEmail, { mfaSecret: config.userSeed.mfaSecret });

    req.session.user = { ...userService.serializeForSession(user), role };
    req.session.lastLoginAt = new Date().toISOString();
    delete req.session.pendingUser;

    req.flash('success', 'Signed in successfully.');
    return res.redirect('/dashboard');
  };

  const showMfa = (req, res) => {
    // MFA disabled: redirect to dashboard
    return res.redirect('/dashboard');
  };

  const verifyMfa = (req, res) => {
    // MFA disabled: redirect to dashboard
    return res.redirect('/dashboard');
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
    login,
    showMfa,
    verifyMfa,
    logout
  };
    if (sessionRole === 'reviewer') redirectTo = '/reviewers';
