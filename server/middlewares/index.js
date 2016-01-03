import controller from './controller';
import createSession from './create-session';
import reqValidator from './req-validator';
import response from './response';
import session from './session';

// README: The order of these MATTER
const middlewares = { response, session, createSession, controller, reqValidator };

export default middlewares;
