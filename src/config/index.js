const path = require('path');
const dotenv = require('dotenv');
const crypto = require('crypto');

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath, override: false });

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  sessionSecret: process.env.SESSION_SECRET,
  azureAd: {
    teamName: process.env.AZURE_AD_TEAM_NAME || 'ZenX',
    clientId: process.env.AZURE_AD_CLIENT_ID || '1a08ab65-fc9b-430c-8852-b601414c7d0f',
    tenantId: process.env.AZURE_AD_TENANT_ID || 'bdcfaa46-3f69-4dfd-b3f7-c582bdfbb820',
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
    redirectUri: process.env.AZURE_AD_REDIRECT_URI || 'http://localhost:3000/auth/azure/callback',
    scopes: (process.env.AZURE_AD_SCOPES || 'openid profile email offline_access').split(' ')
  }
};

if (!config.sessionSecret) {
  // Generate a random secret for local/dev to avoid startup crashes
  config.sessionSecret = crypto.randomBytes(32).toString('hex');
}

if (!config.azureAd.clientSecret) {
  throw new Error('AZURE_AD_CLIENT_SECRET must be set before starting the application.');
}

module.exports = config;

