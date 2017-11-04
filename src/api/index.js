// @flow

import 'babel-polyfill';
import app from './app';
import connectDatabase from '../common/database';
import { apiPort } from '../common/config';

(async () => {
  try {
    await connectDatabase();
  } catch (error) {
    console.error('Database error');
    process.exit(1);
  }

  await app.listen(apiPort);
  console.log(`Server started on port ${apiPort}`);
})();
