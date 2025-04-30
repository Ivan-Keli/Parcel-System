module.exports = (role) => (req, res, next) => {
  // Check if user is logged in
  if (!req.session.user) {
    console.error('Unauthorized access attempt detected. Redirecting to login.');
    return res.redirect('/login'); // Redirect to login if not logged in
  }

  // Check for role-based access
  if (role && req.session.user.role !== role) {
    console.error(
      `Forbidden access attempt by user with role ${req.session.user.role}. Required role: ${role}.`
    );
    return res.status(403).send('Forbidden: You do not have the necessary permissions.');
  }

  next(); // Proceed to the next middleware or route
};
