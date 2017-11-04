// @flow

import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

//see https://github.com/facebook/flow/issues/940
import _AdminUser from './AdminUser';
export const AdminUser = _AdminUser;
import _User from './User';
export const User = _User;
