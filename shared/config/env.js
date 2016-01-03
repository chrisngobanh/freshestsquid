import _ from 'lodash';

const { NODE_ENV } = process.env;

const isProduction = (NODE_ENV === 'production');
const isServer = !process.browser;

export const PORT = process.env.PORT || 8000;

// If the env variable is not set, set it to
// https://cdn.freshestsquid.com/ if production, and / if not
export const CDN_ROOT = process.env.CDN_ROOT ||
                        (isProduction ? 'https://cdn.freshestsquid.com/' : '/');

// If browser, then set to /api
// Otherwise, set it to https://freshestsquid.com/api or localhost:[PORT]/api,
// depending on if production or not
const serverHost =
      (isProduction ? 'https://freshestsquid.com/api' : `http://localhost:${PORT}/api`);
export const API_HOST = (!isServer ? '/api' : serverHost);

// List of all the env variables and their defaults in development mode
const defaultEnvVars = {
  HASHID_SALT: 'Salty Squids on the Saltspray Rig on Splatfest Saturday',
  MYSQL_USER: 'root',
  MYSQL_PW: '',
  SESSION_SECRET: 'https://youtu.be/mZjS6YMb7C4',
  CAPTCHA_KEY: '',
  CAPTCHA_SECRET: '',
};

// Initialize an object that will contain all of the environment variables
const envVars = {};

// Test to see if the environment variables in process.env are valid
_.forEach(defaultEnvVars, (val, key) => {
  if (isProduction && !process.env[key]) {
    throw new Error(`${key} environment variable is not set.`);
  } else {
    // Add this environment variable to envVars from process.env
    // If the environment variable is undefined, use its default value
    envVars[key] = process.env[key] || val;
  }
});

export const { HASHID_SALT, MYSQL_USER, MYSQL_PW, SESSION_SECRET,
              CAPTCHA_KEY, CAPTCHA_SECRET } = envVars;
