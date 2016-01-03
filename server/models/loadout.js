/* eslint new-cap:0 */

import Sequelize from 'sequelize';

import db from '../config/database';
import User from './user';

// Define a db model 'loadout'
const Loadout = db.define('loadout', {
  name: {
    type: Sequelize.STRING(50),
    allowNull: false,
    unique: false,
  },
  isDeleted: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    unique: false,
    defaultValue: false,
  },
  weapon: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false,
    defaultValue: '{}',
  },
  head: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false,
    defaultValue: '{}',
  },
  clothes: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false,
    defaultValue: '{}',
  },
  shoes: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: false,
    defaultValue: '{}',
  },
}, {
  timestamps: true,
  paranoid: true,
});

// Add userId attribute to loadout to hold a reference to a user
Loadout.belongsTo(User);

Loadout.sync();

export default Loadout;
