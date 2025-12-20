const levels = ['debug', 'info', 'warn', 'error'];

const buildLogger = (namespace = 'app') => {
  const format = (level, message, meta) => {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${namespace}] [${level.toUpperCase()}] ${message}${metaString}`;
  };

  const logger = {};
  levels.forEach((level) => {
    logger[level] = (message, meta) => {
      // meta is optional context object
      // eslint-disable-next-line no-console
      console[level === 'debug' ? 'log' : level](format(level, message, meta));
    };
  });

  return logger;
};

module.exports = buildLogger;
