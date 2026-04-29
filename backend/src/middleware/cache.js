const setCacheHeaders = (seconds = 3600) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method === 'GET') {
      res.set('Cache-Control', `public, max-age=${seconds}`);
    }
    next();
  };
};

module.exports = setCacheHeaders;
