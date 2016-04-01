import AboutMenu from '../views/AboutMenu';
import BrowseMenu from '../views/BrowseMenu';
import LoadoutPage from '../views/LoadoutPage';
import LoadoutsMenu from '../views/LoadoutsMenu';
import PrivacyPolicyMenu from '../views/PrivacyPolicyMenu';
import SplashMenu from '../views/SplashMenu';
import Gamepad from '../views/Gamepad';

import axios from '../config/axios';

/**
 * callback docs:
 * @param {string}          Redirect url. Null if no redirect is wanted
 * @param {React Component} The React Component to be rendered
 * @param {object}          Props to be rendered with the React Component
 */
function fetchIndex({ username }, callback) {
  if (!username) {
    callback(null, SplashMenu, {});
  } else {
    callback('/loadouts');
  }
}

function fetchBrowse({ username }, callback) {
  callback(null, BrowseMenu, { username });
}

function fetchLoadouts({ cookie }, callback) {
  const headers = {};
  if (cookie) headers.cookie = cookie;
  axios
    .get('/loadout', { headers })
    .then((res) => {
      switch (res.data.code) {
        case 200:
          const loadouts = res.data.data;
          callback(null, LoadoutsMenu, { loadouts });
          break;
        case 400:
          callback('/');
          break;
        case 500:
        default:
          // TODO: Handle Error
      }
    })
    .catch(() => {
      // TODO: Handle Error
    });
}

function fetchLoadoutsPage({ username, params }, callback) {
  const [loadoutId] = params;
  axios
    .get(`/loadout/${loadoutId}`)
    .then((res) => {
      switch (res.data.code) {
        case 200:
          const loadout = res.data.data;
          callback(null, LoadoutPage, { username, loadout });
          break;
        case 400:
          // TODO: Display Not Found
          break;
        case 500:
        default:
          // TODO: Handle Error
      }
    })
    .catch(() => {
      // TODO: Handle Error
    });
}

function fetchEquipPage({ username, params }, callback) {
  const [loadoutId] = params;
  axios
    .get(`/loadout/${loadoutId}`)
    .then((res) => {
      switch (res.data.code) {
        case 200:
          const loadout = res.data.data;

          // If the user doesn't own this loadout, they shouldn't be here
          if (loadout.user.username !== username) {
            return callback(`/loadouts/${loadoutId}`);
          }

          // The BrowseMenu refers to "weapon" as "weapons", so we need
          // to do this little hack so that it can work with the loadout data
          loadout.weapons = loadout.weapon;
          delete loadout.weapon;

          callback(null, BrowseMenu, { loadout });
          break;
        case 400:
          // If the loadout can't be found, the user shouldn't be here
          callback('/');
          break;
        case 500:
        default:
          // TODO: Handle Error
      }
    })
    .catch(() => {
      // TODO: Handle Error
    });
}

function fetchAbout({}, callback) {
  callback(null, AboutMenu, {});
}

function fetchPrivacy({}, callback) {
  callback(null, PrivacyPolicyMenu, {});
}

function gamepadTest({}, callback) {
  callback(null, Gamepad, {});
}

const routes = {
  '/': fetchIndex,
  '/browse': fetchBrowse,
  '/loadouts': fetchLoadouts,
  '/loadouts/:id': fetchLoadoutsPage,
  '/loadouts/:id/equip': fetchEquipPage,
  '/about': fetchAbout,
  '/privacypolicy': fetchPrivacy,
  '/gamepad': gamepadTest,
};

export default routes;
