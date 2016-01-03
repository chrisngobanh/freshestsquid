function createSessionMiddleware(req, res, next) {
  req.createSession = (user) => {
    req.session.user = { username: user.get('username') };
  };
  next();
}

export default createSessionMiddleware;
