// This file creates an instance of axios that we can reuse throughout the app
import axios from 'axios';

import { API_HOST } from './env';

const instance = axios.create({
  baseURL: API_HOST,
  responseType: 'json',
});

export default instance;
