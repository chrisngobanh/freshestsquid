/* eslint no-console:0 */

import _ from 'lodash';
import bodyParser from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import nunjucks from 'nunjucks';

import api from './api';
import middlewares from './middlewares';

import { CDN_ROOT, PORT } from './config/env';

const app = express();

// Tell Nunjucks to find HTML templates in the shared/views/ directory
const env = nunjucks.configure('shared/views', { express: app });

env.addFilter('cdn', (resource) => CDN_ROOT + resource);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

// Tell Express to serve static files from the public/ directory
app.use(express.static('public'));

// Mount all middleware functions
_.forOwn(middlewares, (value) => app.use(value));

app.use('/api', api);

app.listen(PORT);
console.log('freshestsquid.com running on port %s', PORT);
