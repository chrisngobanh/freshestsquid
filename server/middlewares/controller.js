// This middleware initializes the router for use in Express

import router from '../router';

function controller(req, res, next) {
  router.dispatch(req, res, (err) => {
    if (err) next();
  });
}

export default controller;
