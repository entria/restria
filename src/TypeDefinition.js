// @flow

import type DataLoader from 'dataloader';
import type { Context } from 'koa';
import type { UserType } from './api/loader/UserLoader';

type Key = string | Array<string>;

// Table types
export type TableSinglePrimaryKey = {
  tableName: string,
  primaryKey: string,
  fields: {
    [key: string]: string,
  },
};

export type TableMultiPrimaryKey = {
  tableName: string,
  primaryKeys: Array<string>,
  fields: {
    [key: string]: string,
  },
};

export type Table = TableSinglePrimaryKey | TableMultiPrimaryKey;

// Location
export type LocationHeaders = {
  longitude: string,
  latitude: string,
  locationtimestamp: string,
};

// ApiDataloader
export type ApiDataloaders = {
  UserLoader: DataLoader<Key, *>,
  // only valid on console
  AdminUserLoader: DataLoader<Key, *>,
};

// TODO - type node-pg
export type PgClient = {
  query: ((query: string) => Promise<mixed>) &
    ((text: string, values: Array<any>) => Promise<mixed>),
};

// Args
export type ConnectionCursor = string;

export type ConnectionArguments = {
  before?: ?ConnectionCursor,
  after?: ?ConnectionCursor,
  first?: ?number,
  last?: ?number,
  search?: ?string,
};

// ApiContext
export type ApiContext = {
  ...Context,
  // conns: {
  //   pg: PgClient,
  // },
  user: UserType,
  dataloaders: ApiDataloaders,
  args: ConnectionArguments,
};
