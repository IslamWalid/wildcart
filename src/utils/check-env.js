function checkEnv() {
  const { ALLOWED_ORIGIN, SESSION_SECRET, STRIPE_SECRET_KEY, SALT_ROUNDS } = process.env;

  if (!ALLOWED_ORIGIN) {
    console.error('ALLOWED_ORIGIN environment variable is missing');
    process.exit(1);
  }

  if (!SESSION_SECRET) {
    console.error('SESSION_SECRET environment variable is missing');
    process.exit(1);
  }

  if (!SALT_ROUNDS) {
    console.error('SALT_ROUNDS environment variable is missing');
    process.exit(1);
  }

  if (!STRIPE_SECRET_KEY) {
    console.error('STRIPE_SECRET_KEY environment variable is missing');
    process.exit(1);
  }
}

module.exports = checkEnv;
