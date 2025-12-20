const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env'), override: false });
try {
  const speakeasy = require('speakeasy');
  const secret = process.env.PRIMARY_USER_MFA_SECRET || 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD';
  const code = speakeasy.totp({
    secret,
    encoding: 'base32'
  });
  console.log(code);
  fs.writeFileSync(path.resolve(__dirname, '../totp.txt'), String(code));
} catch (err) {
  console.error('Failed to generate TOTP:', err && err.message ? err.message : err);
  process.exit(1);
}
