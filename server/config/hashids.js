import Hashids from 'hashids';

import { HASHID_SALT } from './env';

const MINLENGTH = 4;
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz1234567890';

const hashids = new Hashids(HASHID_SALT, MINLENGTH, ALPHABET);

export default hashids;
