import async from 'async';
import validator from 'validator';

const keyWords = ['create', 'delete', 'login', 'logout',
                  'password', 'squid', 'inkling', 'loadout',
                  'api', 'id', 'username'];

function username(str, callback) {
  // Check if the username field is empty.
  if (!str) {
    return callback('Username field cannot be empty.');
  }

  // Check if the username is between 3 - 20 characters.
  if (!validator.isLength(str, 3, 20)) {
    return callback('Username must be between 3 to 20 characters long.');
  }

  // Check if the username is a keyword
  if (validator.isIn(str.toLowerCase(), keyWords)) {
    return callback('You can\'t use that username. Try a different one.');
  }

  // Check if the username has only letters, numbers, dashes, and underscores.
  const usernameRegex = /^[a-zA-Z0-9-_]+$/;
  if (!usernameRegex.test(str)) {
    return callback('Username can only contain letters, numbers, dashes, and underscores.');
  }

  return callback();
}

function email(str, callback) {
  // Check if the email field is empty
  if (!str) {
    return callback('Email field cannot be empty.');
  }

  // Check if the email is actually an email
  if (!validator.isEmail(str)) {
    return callback('That is not a valid email.');
  }

  // Check if the email is 255 characters or more
  if (validator.isLength(str, 255)) {
    return callback('Email is too long.');
  }

  return callback();
}

function password(str, callback) {
  // Check if the password field is empty.
  if (!str) {
    return callback('Password field cannot be empty.');
  }

  // Check if the password is longer than 5 characters.
  const pwLength = 5;
  if (!validator.isLength(str, pwLength)) {
    return callback('Password must be at least ' + pwLength + ' characters long.'
    );
  }

  // Check to see if the password is 512 characters or more.
  if (validator.isLength(str, 512)) {
    return callback('Password is too long!');
  }

  return callback();
}

function usernameEmail(str, callback) {
  if (!str) {
    return callback('Username/Email field cannot be empty!');
  }

  // The username/email validator doesn't need anything else because
  // it'll be validated when checking against what's in the db

  return callback();
}

function oldPassword(str, callback) {
  // Check if the old password field is empty.
  if (!str) {
    return callback('Old Password field cannot be empty.');
  }

  // The old password validator doesn't need anything else because
  // it'll be validated when checking against what's in the db

  return callback();
}

function newPassword(str, callback) {
  // Check if the new password field is empty.
  if (!str) {
    return callback('New Password field cannot be empty.');
  }

  // Check if the new password is longer than 5 characters.
  const pwLength = 5;
  if (!validator.isLength(str, pwLength)) {
    return callback('New Password must be at least ' + pwLength + ' characters long.');
  }

  // Check to see if the new password is 512 characters or more.
  if (validator.isLength(str, 512)) {
    return callback('New Password is too long!');
  }

  return callback();
}

function confirmPassword(str, callback) {
  // Check if the confirm password field is empty.
  if (!str) {
    return callback('Confirm Password field cannot be empty.');
  }

  // The confirm password validator doesn't need anything else because the
  // new password validator already handles most of the validation for the password,
  // and confirm password will be validated when compared to the new password

  return callback();
}

function name(str, callback) {
  // Check if the name field is empty.
  if (!str) {
    return callback('Name field cannot be empty.');
  }

  // Check if the name is less than 50 bytes.
  if (!validator.isByteLength(str, 1, 50)) {
    return callback('Name is too long.');
  }

  return callback();
}

const validators = {
  username,
  email,
  password,
  usernameEmail,
  oldPassword,
  newPassword,
  confirmPassword,
  name,
};

const routeParams = {
  '/api/user': ['username', 'email', 'password'],
  '/api/user/login': ['usernameEmail', 'password'],
  '/api/user/logout': [],
  '/api/loadout': ['name'],
};

/**
 * postRequest() handles validating the body of all post requests.
 * @param  {Object}   req  Express request object
 * @param  {Object}   res  Express response object
 * @param  {Function} next When called, it will pass control to the next handler
 */
function validateRequests(req, res, next) {
  // If this request is not on /api, don't do anything
  if (!req.url.startsWith('/api')) return next();

  // If this is a GET request, don't do anything
  if (req.method === 'GET') return next();

  async.each(routeParams[req.url],
    (item, callback) => validators[item](req.body[item], callback),
    (err) => {
      if (err) return res.sendClientError(err);
      next();
    }
  );
}

export default validateRequests;
