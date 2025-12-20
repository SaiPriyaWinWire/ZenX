const speakeasy = require('speakeasy');

const DEFAULT_WINDOW = 1;

const verifyToken = (secret, token) => {
  if (!secret) {
    return false;
  }

  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: DEFAULT_WINDOW
  });
};

const generateSecret = ({ label, issuer }) => speakeasy.generateSecret({
  name: issuer && label ? `${issuer}:${label}` : undefined,
  issuer,
  length: 20
});

const getToken = (secret) => speakeasy.totp({
  secret,
  encoding: 'base32'
});

module.exports = {
  verifyToken,
  generateSecret,
  getToken
};
