/* eslint no-console:0 */
/**
 * An Express Middleware designed to provide a better way for the API to send a response
 * so that the client will have an easier time handling responses to its requests
 *
 * The body of the response sent by the middleware will have:
 * 1. A message, which will be grabbed from the parameter
 * 2. A code of either 200, 400, 401, or 500 to indicate
 *    OK, client error, bad session, or server error, respectively
 *
 * The user will always receive a HTTP Status Code of 200,
 * but will receive either another code in the body of the response
 *
 * Function doc for res.sendOk:
 * Sends a response to the user with a body of:
 * 1. Message: from the parameter
 * 2. Code: 200
 * @param  {string}   message  The message that's included in the body of the response.
 * @param  {Object}   data     Data that will be included in the body of the response.
 *
 * Function doc for res.sendClientError:
 * Sends a response to the user with a body of:
 * 1. Message: from the parameter
 * 2. Code: 400
 * @param  {string}   message  The message that's included in the body of the response.
 *
 * Function doc for res.sendServerError:
 * Traces and logs the error in the parameter and
 * Sends a response to the user with a body of:
 * 1. Message: 'Something went wrong with the server. Try again.'
 * 2. Code: 500
 * @param  {Error}   err  An Error object.
 *
 * Function doc for res.sendBadSession:
 * Destroy the user's session
 * Sends a response to the user with a body of:
 * 1. Message: 'Something went wrong. Please log in again.'
 * 2. Code: 401
 * @param  {string}   message  The message that's included in the body of the response.
 *
 */
function responseMiddleware(req, res, next) {
  res.sendOk = (message, data) => {
    res.send({ message, data, code: 200 });
  };
  res.sendClientError = (message) => res.send({ message, code: 400 });
  res.sendServerError = (err) => {
    console.trace(err.message);
    res.send({
      message: 'Something went wrong with the server. Try again.',
      code: 500,
    });
  };
  res.sendBadSession = () => {
    req.session.destroy();
    res.send({
      message: 'Something went wrong. Please log in again.',
      code: 401,
    });
  };
  next();
}

export default responseMiddleware;
