const DEFAULT_STYLES = ['/css/main.css'];
const DEFAULT_SCRIPTS = ['/js/main.js'];

const assetManager = (options = {}) => {
  const baseStyles = options.styles || DEFAULT_STYLES;
  const baseScripts = options.scripts || DEFAULT_SCRIPTS;

  return (req, res, next) => {
    const styles = [...baseStyles];
    const scripts = [...baseScripts];

    res.locals.addStyle = (href) => {
      if (!styles.includes(href)) {
        styles.push(href);
      }
    };

    res.locals.addScript = (src) => {
      if (!scripts.includes(src)) {
        scripts.push(src);
      }
    };

    res.locals.getStyles = () => styles;
    res.locals.getScripts = () => scripts;
    res.locals.pageTitle = 'ZenX Review Platform';

    next();
  };
};

module.exports = assetManager;
