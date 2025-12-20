const fs = require('fs');
const path = require('path');
try {
  const speakeasy = require('speakeasy');
  const code = speakeasy.totp({
    secret: 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD',
    encoding: 'base32'
  });
  console.log(code);
  fs.writeFileSync(path.resolve(__dirname, '../totp.txt'), String(code));
} catch (err) {
  console.error('Failed to generate TOTP:', err && err.message ? err.message : err);
  process.exit(1);
}
