import _ from 'lodash';
import express from 'express';
import validator from 'validator';

import Loadout from '../models/loadout';
import User from '../models/user';

import hashids from '../config/hashids';

import abilities from '../../shared/data/abilities.json';
import itemsData from '../../shared/data/items.json';

const router = new express.Router();

const itemTypes = ['weapons', 'head', 'clothes', 'shoes'];

/**
 * This function takes a loadout object from MySQL and
 * creates a new loadout object that is appropriate for the client
 * @param  {Object} loadout Loadout object from MySQL
 * @return {Object}         A new loadout object
 */
function mapLoadout(loadout) {
  const { id, name, weapon, head, clothes, shoes } = loadout.get();

  const newLoadout = {
    name,

    // Convert the id into a hash id
    id: hashids.encode(id),

    // Convert items into JSON
    weapon: JSON.parse(weapon),
    head: JSON.parse(head),
    clothes: JSON.parse(clothes),
    shoes: JSON.parse(shoes),
  };

  return newLoadout;
}

/**
 * This function takes a loadout object from MySQL and
 * creates a new loadout object that is appropriate for the client.
 * This function is similar to the one above, except it reveals a bit more data
 * @param  {Object} loadout Loadout object from MySQL
 * @return {Object}         A new loadout object
 */
function mapLoadoutForPage(loadout) {
  const { id, weapon, head, clothes, shoes, user } = loadout.get();

  const newLoadout = loadout.get();
  newLoadout.id = hashids.encode(id);
  newLoadout.weapon = JSON.parse(weapon);
  newLoadout.head = JSON.parse(head);
  newLoadout.clothes = JSON.parse(clothes);
  newLoadout.shoes = JSON.parse(shoes);
  newLoadout.user = user.get();

  return newLoadout;
}

/**
 * Create an empty loadout for the user
 * POST /api/loadout
 */
function createLoadout(req, res) {
  // If the user isn't logged in
  if (!req.session.user) return res.sendClientError('You are not logged in.');

  const { name } = req.body;
  const { username } = req.session.user;

  User.findOne({ where: { username } })
    .then((user) => {
      if (user) {
        return Loadout
                .create({ name, userId: user.get('id') }, {
                  attributes: ['id', 'name', 'weapon', 'head', 'clothes', 'shoes'],
                })
                .then((_loadout) => {
                  const loadout = mapLoadout(_loadout);
                  res.sendOk('You successfully create your loadout!', loadout);
                });
      }

      // Since the user can't be found, their session has bad data
      res.sendBadSession();
    })
    .catch((err) => res.sendServerError(err));
}

/**
 * Get all of the user's loadouts
 * GET /api/loadout
 */
function fetchAllUsersLoadouts(req, res) {
  // If the user isn't logged in
  if (!req.session.user) return res.sendClientError('You are not logged in.');

  const { username } = req.session.user;

  User.findOne({ where: { username } })
    .then((user) => {
      if (user) {
        return Loadout
                .findAll({
                  where: { userId: user.get('id') },
                  attributes: ['id', 'name', 'weapon', 'head', 'clothes', 'shoes'],
                  // include: [{ model: User, attributes: ['username']}],
                })
                .then((_loadouts) => {
                  const loadouts = _.map(_loadouts, mapLoadout);
                  res.sendOk(`Here are your loadouts.`, loadouts);
                });
      }

      // Since the user can't be found, their session has bad data
      res.sendBadSession();
    })
    .catch((err) => res.sendServerError(err));
}

function fetchLoadout(req, res) {
  const { loadoutid } = req.params;

  const id = hashids.decode(loadoutid);

  Loadout
    .findOne({
      where: { id },
      attributes: { exclude: ['isDeleted'] },
      include: [{ model: User, attributes: ['username'] }],
    })
    .then((_loadout) => {
      if (!_loadout) {
        res.sendClientError('Loadout not found!');
      } else {
        const loadout = mapLoadoutForPage(_loadout);
        res.sendOk(`Loadout ${loadout.name} by ${loadout.user.username}`, loadout);
      }
    })
    .catch((err) => res.sendServerError(err));
}

function equipItem(req, res) {
  // If the user isn't logged in
  if (!req.session.user) return res.sendClientError('You are not logged in.');

  const { username } = req.session.user;
  const { loadoutid } = req.params;
  const { name, type } = req.body;

  // Check if name and type are not undefined
  if (!name) return res.sendClientError('You must specify an item to equip.');
  if (!type) return res.sendClientError('Invalid item type.');

  // Check if the type is a valid type
  if (!validator.isIn(type, itemTypes)) return res.sendClientError('Invalid item type.');

  // If the item can't be found
  if (!_.find(itemsData[type], 'name', name)) {
    return res.sendClientError('That is not a valid item.');
  }

  const id = hashids.decode(loadoutid);

  Loadout
    .findOne({
      where: { id },
      include: [{ model: User, attributes: ['username'] }],
    })
    .then((loadout) => {
      // If the loadout was found
      if (loadout) {
        // If the user owns this loadout
        if (username === loadout.get('user').get('username')) {
          const itemString = JSON.stringify({ name });
          const updateObj = {};

          if (type === 'weapons') {
            updateObj.weapon = itemString;
          } else {
            updateObj[type] = itemString;
          }
          return Loadout
                  .update(updateObj, { where: { id } })
                  .then(() => {
                    res.sendOk(`${name} has been equipped.`, { name });
                  });
        }

        res.sendClientError('You do not own this loadout.');
      } else {
        res.sendClientError('Could not find loadout.');
      }
    })
    .catch((err) => res.sendServerError(err));
}

function addAbility(req, res) {
  // If the user isn't logged in
  if (!req.session.user) return res.sendClientError('You are not logged in.');

  const { username } = req.session.user;
  const { loadoutid } = req.params;
  const { name, type, slot } = req.body;

  // Check if name and type are not undefined
  if (!name) return res.sendClientError('You must specify an ability to add.');
  if (!type) return res.sendClientError('Invalid item type.');
  if (!slot) return res.sendClientError('Invalid slot number.');

  // Check if the type is a valid type
  if (!validator.isIn(type, itemTypes)) return res.sendClientError('Invalid item type.');

  // Check if the slot is an int and is 1-3
  if (!validator.isInt(slot.toString(), { min: 1, max: 3 })) {
    return res.sendClientError('Invalid slot number.');
  }

  // You can't add an ability to the weapon slot
  if (type === 'weapons') return res.sendClientError('Invalid item type.');

  const abilityCheck = _.find(abilities, 'name', name);

  // If the ability can't be found
  if (!abilityCheck) return res.sendClientError('That is not a valid ability.');

  // If the user is trying to add a main ability
  if (abilityCheck.type !== 'Any') return res.sendClientError('That is not a valid ability.');

  const id = hashids.decode(loadoutid);

  Loadout
    .findOne({
      where: { id },
      include: [{ model: User, attributes: ['username'] }],
    })
    .then((loadout) => {
      // If the loadout was found
      if (loadout) {
        // If the user owns this loadout
        if (username === loadout.get('user').get('username')) {
          const loadoutItem = JSON.parse(loadout.get(type));

          loadoutItem[`ability${slot}`] = name;

          const updateObj = {};

          updateObj[type] = JSON.stringify(loadoutItem);
          return Loadout
                  .update(updateObj, { where: { id } })
                  .then(() => {
                    res.sendOk(`${name} has been added to ${loadoutItem.name}.`, { name, slot });
                  });
        }

        res.sendClientError('You do not own this loadout.');
      } else {
        res.sendClientError('Could not find loadout.');
      }
    })
    .catch((err) => res.sendServerError(err));
}

router.post('/', createLoadout);
router.get('/', fetchAllUsersLoadouts);
router.get('/:loadoutid', fetchLoadout);
router.post('/:loadoutid/equip', equipItem);
router.post('/:loadoutid/addability', addAbility);
export default router;
