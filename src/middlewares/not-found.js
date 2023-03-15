const log = require('../configs/log');

const notFound = async (req, res, next) => {
  log.warn({
    message: 'route not found',
    meta: {
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.body
    }
  });
  res.status(404).json({ message: 'resource not found' });
};

module.exports = notFound;
