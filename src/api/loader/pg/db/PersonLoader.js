/* @flow */
import DataLoader from 'dataloader';
import { dbs } from '../../../../common/config';
import pgLoader from '../pgLoader';

import type { GraphQLContext, TableSinglePrimaryKey } from '../../../TypeDefinition';

export const tActivity: TableSinglePrimaryKey = {
  tableName: 'activity',
  primaryKey: 'id',
  fields: {
    id: 'id',
    user_id: 'userId',
    title: 'title',
    category: 'category',
    description: 'description',
    activity_time: 'activityTime',
    active: 'active',
    created_at: 'createdAt',
    updated_at: 'updatedAt',
  },
};

export type ActivityType = {
  id: string,
  user_id: string,
  title: string,
  category: string,
  description: string,
  activity_time: string,
  active: boolean,
  created_at: ?string,
  updated_at: ?string,
};

export default class Activity {
  id: string;
  _id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  activityTime: Date;
  active: boolean;
  createdAt: ?Date;
  updatedAt: ?Date;

  constructor(data: ActivityType) {
    this.id = data.id;
    this._id = data.id;
    this.userId = data.user_id;
    this.title = data.title;
    this.description = data.description;
    this.category = data.category;
    this.active = data.active;
    this.activityTime = new Date(data.activity_time);
    this.createdAt = data.created_at ? new Date(data.created_at) : null;
    this.updatedAt = data.updated_at ? new Date(data.updated_at) : null;
  }
}

const viewerCanSee = (/*context: GraphQLContext , data: ActivityType*/): boolean => true;

export const getLoader = (context: GraphQLContext) =>
  new DataLoader(async ids => pgLoader(context[dbs.appfv.name], tActivity, ids), {
    maxBatchSize: 500,
  });

export const load = async (context: GraphQLContext, id: string): Promise<?Activity> => {
  if (!id) return null;

  const loader = context.dataloaders.ActivityLoader;

  const data = await loader.load(id);

  if (!data) return null;

  return viewerCanSee(context, data) ? new Activity(data) : null;
};

export const clearCache = (context: GraphQLContext, id: string) =>
  context.dataloaders.ActivityLoader.clear(id.toString());