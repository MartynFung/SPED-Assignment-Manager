const errorHandler = (err, req, res, next) => {
  if (typeof err === 'string') {
    return res.status(400).json({ msg: err });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ msg: 'Invalid Token' });
  }

  return res.status(500).json({ msg: err.message });
};

module.exports = errorHandler;
