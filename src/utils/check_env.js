function checkEnv() {
  const { NODE_CONFIG_DIR, ALLOWED_ORIGIN, SESSION_SECRET } = process.env;

  if (!NODE_CONFIG_DIR) {
    console.error('NODE_CONFIG_DIR environment variable is missing');
    process.exit(1);
  }

  if (!ALLOWED_ORIGIN) {
    console.error('ALLOWED_ORIGIN environment variable is missing');
    process.exit(1);
  }

  if (!SESSION_SECRET) {
    console.error('SESSION_SECRET environment variable is missing');
    process.exit(1);
  }
}

module.exports = checkEnv;
