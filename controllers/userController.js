const express = require('express');
const User = require('../models/User');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Admin: View all users
router.get('/', authMiddleware('admin'), async (req, res) => {
  try {
    const users = await User.find();
    res.render('manage_users', { users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Error fetching users');
  }
});

// Admin: Change user role
router.post('/role/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    await User.findByIdAndUpdate(req.params.id, { role });
    res.redirect('/users');
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).send('Error updating user role');
  }
});

// Admin: Remove a user
router.post('/delete/:id', authMiddleware('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users');
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Error deleting user');
  }
});

// Admin: Search for Users
router.get('/search', authMiddleware('admin'), async (req, res) => {
  const query = req.query.q;
  try {
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { registrationNumber: { $regex: query, $options: 'i' } },
      ],
    });
    res.render('manage_users', { users });
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).send('Error searching users');
  }
});

// Admin: Edit User Details
router.post('/edit/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const { name, email, role } = req.body;
    await User.findByIdAndUpdate(req.params.id, { name, email, role });
    res.redirect('/users');
  } catch (error) {
    console.error('Error editing user:', error);
    res.status(500).send('Error editing user');
  }
});

module.exports = router;
