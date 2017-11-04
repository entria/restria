// @flow

import mongoose from 'mongoose';
import bcrypt from 'bcrypt-as-promised';

const Schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },
    password: {
      type: String,
      description: 'Admin User Hashed Password',
      required: true,
      hidden: true,
    },
    name: {
      type: String,
      description: 'Admin Complete Name',
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'AdminUser',
  },
);

Schema.pre('save', function(next) {
  // Hash the password
  if (this.isModified('password')) {
    this.encryptPassword(this.password)
      .then(hash => {
        this.password = hash;
        next();
      })
      .catch(err => next(err));
  } else {
    return next();
  }
});

Schema.methods = {
  async authenticate(plainText) {
    try {
      return await bcrypt.compare(plainText, this.password);
    } catch (err) {
      return false;
    }
  },
  encryptPassword(password) {
    return bcrypt.hash(password, 8);
  },
};

export default mongoose.model('AdminUser', Schema);
