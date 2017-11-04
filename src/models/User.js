// @flow

import mongoose from 'mongoose';
import bcrypt from 'bcrypt-as-promised';

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    nick: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      index: true,
    },
    password: {
      type: String,
      hidden: true,
    },
    active: {
      type: Boolean,
      default: true,
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
      description: 'Whether this user has confirmed his/her email or not',
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'User',
  },
);

Schema.index({ name: 'text' });

Schema.pre('validate', function(next) {
  // eslint-disable-line func-names
  // If nick is not defined create one using the user Name and Random String
  // User can always change the nick latter
  if (!this.nick && this.email) {
    // Get the username of the email
    this.nick = this.email.split('@')[0];

    // Generate a random four-character string
    // const random = Math.random().toString(36).substring(2,4);
    // const nick = this.name
    //   .replace('@', 'a')
    //   .replace(' ', '')
    //   .replace('_', '-')
    //   .concat('-')
    //   .concat(random)
    //   .replace('--', '-');
    // // Covert accents & others to simple characters using diacritics
    // this.nick = remove(nick).replace(' ', '').toLowerCase();
  }
  next();
});

Schema.pre('save', function(next) {
  // eslint-disable-line func-names
  // Hash the password
  if (this.isModified('password')) {
    this.encryptPassword(this.password)
      .then(hash => {
        console.log(this.password, hash);
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

export default mongoose.model('User', Schema);
