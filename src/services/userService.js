const bcrypt = require('bcrypt');
const { randomUUID } = require('crypto');
const createLogger = require('../utils/logger');

const logger = createLogger('user-service');
const users = new Map();

const getSeedDefaults = () => ({
  email: process.env.PRIMARY_USER_EMAIL || 'admin@example.com',
  password: process.env.PRIMARY_USER_PASSWORD || 'ChangeMe123!',
  mfaSecret: process.env.PRIMARY_USER_MFA_SECRET || 'KVKFKRCPNZQUYMLXOVYDSQKJKZDTSRLD'
});

const normalizeEmail = (email) => email.trim().toLowerCase();

const createUserRecord = async ({ email, password, mfaSecret, id }) => {
  let passwordHash = null;
  if (password) {
    passwordHash = await bcrypt.hash(password, 10);
  }
  return {
    id: id || randomUUID(),
    email: normalizeEmail(email),
    passwordHash,
    mfaSecret
  };
};

const bootstrap = async () => {
  const seedConfig = getSeedDefaults();
  const seedEmail = normalizeEmail(seedConfig.email);
  if (users.has(seedEmail)) {
    return;
  }

  const record = await createUserRecord({
    email: seedEmail,
    password: seedConfig.password,
    mfaSecret: seedConfig.mfaSecret,
    id: 'seed-user'
  });

  users.set(seedEmail, record);
  logger.info('Seed user registered', { email: record.email });
};

const upsertUser = (userRecord) => {
  const email = normalizeEmail(userRecord.email);
  users.set(email, userRecord);
  logger.info('User upserted', { email });
  return userRecord;
};

const getUserByEmail = (email) => {
  const normalized = normalizeEmail(email);
  return users.get(normalized) || null;
};

const verifyPassword = async (user, password) => bcrypt.compare(password, user.passwordHash);

const serializeForSession = (user) => ({
  id: user.id,
  email: user.email
});

const listUsers = () => Array.from(users.values());

const ensureUser = async (email, { mfaSecret } = {}) => {
  const existing = getUserByEmail(email);
  if (existing) return existing;
  const record = await createUserRecord({
    email,
    password: '',
    mfaSecret: mfaSecret || getSeedDefaults().mfaSecret
  });
  upsertUser(record);
  return record;
};

module.exports = {
  bootstrap,
  upsertUser,
  getUserByEmail,
  verifyPassword,
  serializeForSession,
  listUsers,
  createUserRecord,
  ensureUser
};
