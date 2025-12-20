const dashboard = (req, res) => {
  res.locals.pageTitle = 'Dashboard';
  res.render('dashboard/index', {
    layout: 'layouts/main',
    user: req.session.user,
    lastLoginAt: req.session.lastLoginAt
  });
};

module.exports = {
  dashboard
};
