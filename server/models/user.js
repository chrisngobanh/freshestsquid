/* eslint new-cap:0 */

import Sequelize from 'sequelize';

import db from '../config/database';

// Define a db model 'user'
const User = db.define('user', {
  username: {
    type: Sequelize.STRING(20),
    allowNull: false,
    unique: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING(512),
    allowNull: false,
    unique: false,
  },
  isDeleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    unique: false,
    defaultValue: false,
  },
  friendCode: {
    type: Sequelize.CHAR(12),
    allowNull: true,
    unique: false,
  },
}, {
  timestamps: true,
  paranoid: true,
});

User.sync();

export default User;
