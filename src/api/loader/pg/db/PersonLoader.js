// @flow
import DataLoader from 'dataloader';
import { dbs } from '../../../../common/config';
import pgLoader from '../pgLoader';

import tPerson from '../../../type/PersonType';

import type { ApiContext } from '../../../../TypeDefinition';
import type { PersonType } from '../../../type/PersonType';

export default class Person {
  id: string;
  name: string;
  nick: ?string;
  email: string;
  password: string;
  active: boolean;
  emailVerified: boolean;
  createdAt: ?Date;
  updatedAt: ?Date;

  constructor(data: PersonType) {
    this.id = data.id;
    this.name = data.name;
    this.nick = data.nick;
    this.email = data.email;
    this.password = data.password;
    this.active = data.active;
    this.emailVerified = data.email_verified;
    this.createdAt = data.created_at ? new Date(data.created_at) : null;
    this.updatedAt = data.updated_at ? new Date(data.updated_at) : null;
  }
}

const viewerCanSee = (): boolean => true;

export const getLoader = (context: ApiContext) => {
  return new DataLoader(async ids => pgLoader(context.conns.restria, tPerson, ids), {
    maxBatchSize: 500,
  });
};

export const load = async (context: ApiContext, id: string): Promise<?Person> => {
  if (!id) return null;

  const data = await context.dataloaders.PersonLoader.load(id);

  if (!data) return null;

  return viewerCanSee() ? new Person(data) : null;
};

export const clearCache = (context: ApiContext, id: string) =>
  context.dataloaders.PersonLoader.clear(id.toString());
