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
