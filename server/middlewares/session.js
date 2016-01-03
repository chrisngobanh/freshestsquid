import expressSession from 'express-session';
import sessionSequelize from 'connect-session-sequelize';

import db from '../config/database';
import { NODE_ENV, SESSION_SECRET } from '../config/env';

const SequelizeStore = sessionSequelize(expressSession.Store);

// If the app is running in production, proxy = true. Otherwise proxy = false;
const proxy = (NODE_ENV === 'production');

const store = new SequelizeStore({ db });

const session = expressSession({
  proxy,
  store,
  cookie: {
    httpOnly: true,
    // 7 days
    maxAge: 604800 * 1000,
    secure: 'auto',
  },
  resave: true,
  saveUninitialized: false,
  secret: SESSION_SECRET,
});

store.sync();

export default session;
