const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  res.status(401).json({ message: 'unauthorized user' });
};

const authenticateCustomer = (req, res, next) => {
  if (req.isAuthenticated() && req.user.userType === 'customer') {
    return next();
  }

  res.status(401).json({ message: 'unauthorized user' });
};

const authenticateSeller = (req, res, next) => {
  if (req.isAuthenticated() && req.user.userType === 'seller') {
    return next();
  }

  res.status(401).json({ message: 'unauthorized user' });
};

module.exports = {
  authenticateUser,
  authenticateSeller,
  authenticateCustomer
};
