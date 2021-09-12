const path = require('path');

const envPath = path.join(__dirname, `./environments/${process.env.NODE_ENV}.env`);
require('dotenv').config({ path: envPath });

const environmentVariables = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_DB: process.env.MONGO_DB,
};

const getEnvironmentVariables = () => {
  if (!environmentVariables.NODE_ENV) {
    throw new Error('Missing NODE_ENV envirnment variables');
  }

  if (environmentVariables.NODE_ENV === 'test') {
    return {
      NODE_ENV: environmentVariables.NODE_ENV,
      PORT: environmentVariables.PORT,
    };
  }

  return environmentVariables;
};

Object.entries(getEnvironmentVariables()).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing ${key} environment variable`);
  }
});

module.exports = getEnvironmentVariables();
