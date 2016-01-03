import _ from 'lodash';
import axios from 'axios';
import bcrypt from 'bcrypt';
import express from 'express';
import bluebird from 'bluebird';

import Loadout from '../models/loadout';
import User from '../models/user';

import hashids from '../config/hashids';
import { CAPTCHA_SECRET } from '../config/env';

const router = new express.Router();

/**
 * Handle the 'inkling'(user) creation process
 * POST /api/user
 */
function createUser(req, res) {
  // If the user is already logged in, don't do anything
  if (req.session.user) {
    return res.sendClientError('You can\'t create an account when you\'re logged in.');
  }

  // Grab the needed fields from the body
  const { username, email, password } = req.body;
  const key = req.body['g-recaptcha-response'];
  axios
    .post(`https://www.google.com/recaptcha/api/siteverify` +
          `?secret=${CAPTCHA_SECRET}&response=${key}`
          )
    .then(({ data }) => {
      if (!CAPTCHA_SECRET || data.success) {
        return User.findOne({ where: { $or: { username, email } } })
          .then((user) => {
            if (!user) {
              // No match, which is good! Keep going.
              // Convert bcrypt.hash into a function that returns a Promise
              const bcryptHash = bluebird.promisify(bcrypt.hash);

              // Call the function and return its result
              return bcryptHash(password, 10)
                      .then((hash) => User.create({ username, email, password: hash }))
                      .then((newUser) => {
                        req.createSession(newUser);
                        res.sendOk('You created your account!',
                          { username: newUser.get('username') }
                        );
                      });
            }

            // Figure out what matched to send an appropriate response
            // Check if it was the username that matched
            if (username.toLowerCase() === user.get('username').toLowerCase()) {
              res.sendClientError('This username has already been taken.');

              // Check if it was the username that matched
            } else if (email.toLowerCase() === user.get('email').toLowerCase()) {
              res.sendClientError('This email has already been taken.');

              // If neither matched, somehow something went wrong with the server.
            } else {
              throw new Error(
                `createInkling() found a user in the initial query,` +
                `but couldn\'t figure out why it matched.\n` +
                `Inputed - Username: ${username} | Email: ${email}\n` +
                `Matched - Username: ${user.get('username')} | Email: ${user.get('email')}`
              );
            }
          });
      }

      res.sendClientError('Captcha failed. Please try again.');
    })
    .catch((err) => res.sendServerError(err));
}

/**
 * Returns the user's username
 * GET /api/user
 */
function fetchUsersData(req, res) {
  if (req.session.user) {
    return res.sendOk('Here\'s your data.', { username: req.session.user.username });
  }

  // This is considered to be OK because this method will be called
  // regardless of whether or not the user is logged in
  return res.sendOk('User is not logged in.');
}

function authenticateUser(req, res) {
  const { usernameEmail, password } = req.body;

  // If the user is already logged in, don't do anything
  if (req.session.user) return res.sendClientError('You\'re already logged in.');

  User.findOne({ where: { $or: { username: usernameEmail, email: usernameEmail } } })
    .then((user) => {
      if (user) {
        // Convert bcrypt.compare into a function that returns a Promise
        const bcryptCompare = bluebird.promisify(bcrypt.compare);

        return bcryptCompare(password, user.get('password'))
                .then((isEqual) => {
                  if (isEqual) {
                    req.createSession(user);
                    res.sendOk('You have logged in.', { username: user.get('username') });
                  } else {
                    res.sendClientError('You entered the wrong password.');
                  }
                });
      }
      res.sendClientError('Username or Email not found.');
    });
}

function logoutUser(req, res) {
  if (req.session.user) {
    req.session.destroy(() => res.sendOk('You have successfully logged out.'));
  } else {
    res.sendClientError('You are not logged in.');
  }
}

function mapLoadout(loadout) {
  const { id, name, stars, weapon, head, clothes, shoes } = loadout.get();

  const newLoadout = {
    name,
    stars,
    weapon,
    head,
    clothes,
    shoes,

    // Convert the id into a hash id
    id: hashids.encode(id),
  };

  return newLoadout;
}

function fetchAllLoadoutsFromUser(req, res) {
  const { username } = req.params;

  User.findOne({ where: { username } })
    .then((user) => {
      if (user) {
        return Loadout
                .findAll({
                  where: { userId: user.get('id') },
                  attributes: ['id', 'name', 'stars', 'weapon', 'head', 'clothes', 'shoes'],
                  // include: [{ model: User, attributes: ['username']}],
                })
                .then((_loadouts) => {
                  const loadouts = _.map(_loadouts, mapLoadout);
                  res.sendOk(`Here are your loadouts.`, { loadouts });
                });
      }
      res.sendClientError('User not found.');
    })
    .catch((err) => res.sendServerError(err));
}


router.post('/', createUser);
router.get('/', fetchUsersData);
router.get('/:username', fetchAllLoadoutsFromUser);
router.post('/login', authenticateUser);
router.post('/logout', logoutUser);

export default router;
