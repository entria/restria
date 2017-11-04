// @flow

import * as UserLoader from '../loader/UserLoader';

import type { ApiContext } from '../../TypeDefinition';

const userGet = async (ctx: ApiContext) => {
  const { id } = ctx.params;

  if (!id) {
    ctx.throw(400, 'Missing id');
  }

  try {
    console.log('CONTEXT:', ctx.context);
    // console.log('USERLOADER:', UserLoader.load(ctx, id));
    ctx.body = await UserLoader.load(ctx.context, id);
    ctx.status = 200;
  } catch (err) {
    console.log('user GET : ', err);
    ctx.throw(409, `Database query error: ${err}`);
  }
};

export default userGet;
