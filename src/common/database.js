// @flow

import mongoose from 'mongoose';

import { databaseConfig } from './config';

export default function connectDatabase() {
  return new Promise((resolve, reject) => {
    mongoose.Promise = global.Promise;
    mongoose.connection
      // Reject if an error ocurred when trying to connect to MongoDB
      .on('error', error => {
        console.log('Error connection to DB failed');
        reject(error);
      })
      // Exit Process if there is no longer a Database Connection
      .on('close', () => {
        console.log('Lost connection to DB');
        process.exit(1);
      })
      // Connected to DB
      .once('open', () => {
        // Display connection information
        const infos = mongoose.connections;
        infos.map(info => console.log(`Connected to ${info.host}:${info.port}/${info.name}`));
        // Return sucessfull promisse
        resolve();
      });

    mongoose.connect(databaseConfig, { useMongoClient: true, promiseLibrary: global.Promise });
  });
}
