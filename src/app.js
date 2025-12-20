const path = require('path');
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const config = require('./config');
const assetManager = require('./middleware/assetManager');
const routes = require('./routes');
const userService = require('./services/userService');
const createLogger = require('./utils/logger');

const logger = createLogger('server');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, '../views'));
app.set('layout', 'layouts/main');

app.use(expressLayouts);
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Serve static assets but do NOT serve index.html at '/'
app.use(express.static(path.resolve(__dirname, '../public'), { index: false }));

app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.env === 'production'
  }
}));

app.use(flash());
app.use(assetManager());

app.use((req, res, next) => {
  res.locals.appName = 'AI-Powered TQA Review Management';
  res.locals.currentUser = req.session.user || null;
  res.locals.flash = {
    success: req.flash('success'),
    error: req.flash('error'),
    info: req.flash('info')
  };
  next();
});

app.use(routes);

app.use((req, res) => {
  res.status(404);
  res.locals.pageTitle = 'Not Found';
  res.render('error', {
    layout: 'layouts/main',
    statusCode: 404,
    message: 'The page you are looking for does not exist.'
  });
});

app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500);
  res.locals.pageTitle = 'Server Error';
  res.render('error', {
    layout: 'layouts/main',
    statusCode: 500,
    message: 'Something went wrong. Please try again.'
  });
});

const start = async () => {
  await userService.bootstrap();
  // Bind to all interfaces to support localhost on IPv4/IPv6
  const host = process.env.HOST; // optional; if undefined, Express listens on all
  app.listen(config.port, host, () => {
    logger.info(`Server listening on port ${config.port}`);
  });
};

if (require.main === module) {
  start().catch((error) => {
    logger.error('Failed to start server', { error: error.message });
    process.exitCode = 1;
  });
}

module.exports = { app, start };

