// @flow

import type { Middleware } from 'koa';

import * as loaders from '../loader';
import type { ApiContext } from '../../TypeDefinition';

const dataloader = (): Middleware => async (ctx: ApiContext, next) => {
  const dataloaders = Object.keys(loaders).reduce(
    (prev, loader) => ({
      ...prev,
      [loader]: loaders[loader].getLoader(),
    }),
    {},
  );

  const context = {
    dataloaders,
  };

  ctx.context = {
    ...context,
  };

  // console.log('CTX:', ctx.context);

  await next();
};

export default dataloader;
