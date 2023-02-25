function authenticateUser(req, res, next) {
  if (req.isAuthenticated()) {
    next();
    return;
  }

  res.status(401).json({ msg: 'unauthorized user' });
}

function authenticateCustomer(req, res, next) {
  if (req.isAuthenticated() && req.user.userType === 'customer') {
    next();
    return;
  }

  res.status(401).json({ msg: 'unauthorized user' });
}

function authenticateSeller(req, res, next) {
  if (req.isAuthenticated() && req.user.userType === 'seller') {
    next();
    return;
  }

  res.status(401).json({ msg: 'unauthorized user' });
}

module.exports = {
  authenticateUser,
  authenticateSeller,
  authenticateCustomer
};
