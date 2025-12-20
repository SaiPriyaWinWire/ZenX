const crypto = require('crypto');
const msal = require('@azure/msal-node');
const config = require('../config');
const createLogger = require('../utils/logger');

const logger = createLogger('azure-ad-service');

const authority = `https://login.microsoftonline.com/${config.azureAd.tenantId}`;

const confidentialClient = new msal.ConfidentialClientApplication({
  auth: {
    clientId: config.azureAd.clientId,
    authority,
    clientSecret: config.azureAd.clientSecret
  },
  system: {
    loggerOptions: {
      loggerCallback(level, message) {
        if (level <= msal.LogLevel.Warning) {
          logger.warn('MSAL warning', { message });
        }
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Warning
    }
  }
});

const defaultAuthParams = {
  scopes: config.azureAd.scopes,
  redirectUri: config.azureAd.redirectUri
};

const generateState = () => crypto.randomUUID();

const getAuthCodeUrl = async ({ state, scopes, redirectUri } = {}) => {
  const params = {
    ...defaultAuthParams,
    scopes: scopes || defaultAuthParams.scopes,
    redirectUri: redirectUri || defaultAuthParams.redirectUri,
    state: state || generateState(),
    prompt: 'select_account',
    responseMode: 'query'
  };

  return confidentialClient.getAuthCodeUrl(params);
};

const acquireTokenByCode = async ({ code, scopes, redirectUri }) => {
  const tokenRequest = {
    ...defaultAuthParams,
    scopes: scopes || defaultAuthParams.scopes,
    redirectUri: redirectUri || defaultAuthParams.redirectUri,
    code
  };

  return confidentialClient.acquireTokenByCode(tokenRequest);
};

module.exports = {
  generateState,
  getAuthCodeUrl,
  acquireTokenByCode
};
