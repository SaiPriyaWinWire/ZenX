const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const createClient = (tenantId) => jwksClient({
  jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`,
  cache: true,
  rateLimit: true
});

const verifyIdToken = async (idToken, { clientId, tenantId }) => {
  if (!idToken) throw new Error('Missing id_token');
  if (!clientId || !tenantId) throw new Error('Missing Azure AD config');

  const client = createClient(tenantId);

  const getKey = (header, callback) => {
    client.getSigningKey(header.kid, (err, key) => {
      if (err) return callback(err);
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    });
  };

  const issuer = `https://login.microsoftonline.com/${tenantId}/v2.0`;

  return new Promise((resolve, reject) => {
    jwt.verify(idToken, getKey, {
      algorithms: ['RS256'],
      audience: clientId,
      issuer
    }, (err, payload) => {
      if (err) return reject(err);
      resolve(payload);
    });
  });
};

module.exports = { verifyIdToken };
