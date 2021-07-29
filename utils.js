const logHistory = (req, res, next) => {
    let { history } = req.session;
    if (!history) {
      history = [];
      req.session.history = history;
    }
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    history.unshift(url);
    next();
  };

  module.exports = {logHistory}
