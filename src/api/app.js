// @flow

import 'isomorphic-fetch';

import Koa from 'koa';
import cors from 'kcors';
// import convert from 'koa-convert';
import logger from 'koa-logger';
import Router from 'koa-router';
// import multer from 'koa-multer';
// import prettyFormat from 'pretty-format';

import dataloader from './middlewares/dataloader';
import { jwtSecret } from '../common/config';
// import { logApiErrorToSlack } from '../common/slack';
// import { getUser, getLocation } from './helper';

import index from './routes/index';
import userGet from './routes/UserGet';

const app = new Koa();

app.keys = jwtSecret;

const router = new Router();
// const storage = multer.memoryStorage();
// https://github.com/expressjs/multer#limits
// const limits = {
//   // Increasing max upload size to 30 mb, since busboy default is only 1 mb
//   fieldSize: 30 * 1024 * 1024,
// };

app.use(logger());
app.use(cors());
app.use(dataloader());

router
  .get('/', index)
  .get('/api', index)
  .get('/api/v1', index)
  .get('/api/v1/user/:id', userGet);

// router.all('/api', multer({ storage, limits }).any());
app.use(router.routes()).use(router.allowedMethods());

export default app;
