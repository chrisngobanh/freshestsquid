/* eslint no-console:0 */

import Sequelize from 'sequelize';

import { MYSQL_USER, MYSQL_PW } from './env';

const connection = new Sequelize('freshestsquid', MYSQL_USER, MYSQL_PW,
  { host: 'localhost', dialect: 'mysql', logging: false, dialectOptions: { charset: 'utf8mb4' } }
);

connection.authenticate()
  .then(() => console.log('Successfully connected to the database'))
  .catch((err) => {
    console.log('Failed to connect to the database.');
    throw err;
  });
export default connection;
