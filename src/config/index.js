const path = require('path');
const dotenv = require('dotenv');
const crypto = require('crypto');

const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath, override: false });


  azure: {
    tenantId: process.env.AZURE_TENANT_ID,
    clientId: process.env.AZURE_CLIENT_ID,
    redirectUri: process.env.AZURE_REDIRECT_URI
  }};

if (!config.sessionSecret) {
  // Generate a random secret for local/dev to avoid startup crashes
  config.sessionSecret = crypto.randomBytes(32).toString('hex');
}

module.exports = config;

