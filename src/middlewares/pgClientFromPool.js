// @flow

import type { Middleware } from 'koa';

import pools from '../dbs/postgres';

const pgClientFromPool = (): Middleware => async (ctx, next) => {
  // there is no need to get an exclusive client from the pool
  ctx.conns = {
    ...pools,
  };

  await next();
};

export default pgClientFromPool;
