// @flow

import DataLoader from 'dataloader';
import { Types } from 'mongoose';

import connectionFromMongoCursor from './ConnectionFromMongoCursor';
import UserModel from '../../models/User';
import mongooseLoader from './mongooseLoader';

import type { ApiContext, ConnectionArguments } from '../../TypeDefinition';

export type UserType = {
  id: string,
  _id: Types.ObjectId,
  email: string,
  password: string,
  name: string,
  nick: string,
  active: boolean,
  emailVerified: boolean,
  createdAt: Date,
  updatedAt: Date,
};

export default class User {
  id: string;
  _id: string;
  name: string;
  nick: string;
  email: string;
  active: boolean;
  emailVerified: boolean;
  hasPassword: boolean;

  constructor(data: UserType, { user }: ApiContext) {
    this.id = data.id;
    this._id = data._id;
    this.name = data.name;
    this.nick = data.nick;

    // only you can see your details
    if (user && user._id.equals(data._id)) {
      this.email = data.email;
      this.active = data.active;
      this.emailVerified = data.emailVerified;
      this.hasPassword = !!data.password;
    }
  }
}

export const getLoader = () => new DataLoader(ids => mongooseLoader(UserModel, ids));

const viewerCanSee = (viewer, data) => {
  // Anyone can se another user
  return true;
};

export const load = async (context: ApiContext, id: ?string): Promise<?User> => {
  if (!id) return null;

  const data = await context.dataloaders.UserLoader.load(id);

  if (!data) return null;

  return viewerCanSee(context, data) ? new User(data, context) : null;
};

export const clearCache = ({ dataloaders }: ApiContext, id: string) => {
  return dataloaders.UserLoader.clear(id.toString());
};

export const loadUsers = async (context: ApiContext, args: ConnectionArguments) => {
  const where = args.search
    ? {
        name: {
          $regex: new RegExp(`^${args.search}`, 'ig'),
        },
      }
    : {};
  const users = UserModel.find(where, { _id: 1 }).sort({
    createdAt: -1,
  });

  return connectionFromMongoCursor({
    cursor: users,
    context,
    args,
    loader: load,
  });
};
