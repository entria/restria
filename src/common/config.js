// @flow

import path from 'path';
import dotenvSafe from 'dotenv-safe';

const root = path.join.bind(this, __dirname, '../../');

dotenvSafe.load({
  path: root('.env'),
  sample: root('.env.example'),
});

// Display a friendly message on console to indicate if we're are runnning in a prodution or development enviroment
const status = process.env.NODE_ENV === 'production' ? 'production' : 'development';

if (process.env.NODE_ENV)
  console.log(`CONFIG: NODE_ENV: '${process.env.NODE_ENV}' running in: '${status}'`);

// Export DB Settings
export const databaseConfig = process.env.MONGO_URI;

// Export worker settings
export const redisConfig = {
  redis: {
    host: process.env.REDIS_HOST,
  },
};

// Ports
export const apiPort = process.env.API_PORT || 3009;

// Slack
export const slackWebhook = process.env.SLACK_WEBHOOK;

export const jwtSecret = process.env.JWT_KEY;
