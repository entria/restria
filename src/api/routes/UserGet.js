// @flow

import * as UserLoader from '../loader/UserLoader';

import type { ApiContext } from '../../TypeDefinition';

const userGet = async (ctx: ApiContext) => {
  const { id } = ctx.params;

  if (!id) {
    ctx.throw(400, 'Missing id');
  }

  try {
    ctx.status = 200;
    ctx.body = await UserLoader.load(ctx, id);
  } catch (err) {
    ctx.throw(404, err);
  }
};

export default userGet;