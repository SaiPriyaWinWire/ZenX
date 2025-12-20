const ensureAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }

  req.flash('info', 'Please sign in to continue.');
  return res.redirect('/login');
};

const ensureMfaPending = (req, res, next) => {
  if (req.session.pendingUser) {
    return next();
  }

  req.flash('info', 'Start with your email and password.');
  return res.redirect('/login');
};

const redirectIfAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }

  return next();
};

module.exports = {
  ensureAuthenticated,
  ensureMfaPending,
  redirectIfAuthenticated
};

const ensureRole = (required) => (req, res, next) => {
  const user = req.session.user;
  if (!user) {
    req.flash('info', 'Please sign in to continue.');
    return res.redirect('/login');
  }
  const current = String(user.role || '').toLowerCase();
  const needed = String(required || '').toLowerCase();
  if (current === needed) return next();
  return res.status(403).render('error', { layout: 'layouts/main', statusCode: 403, message: 'Forbidden: insufficient role' });
};

module.exports.ensureRole = ensureRole;
