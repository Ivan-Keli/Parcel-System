const express = require('express');
const Complaint = require('../models/Complaint');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Admin: View all complaints
router.get('/', authMiddleware('admin'), async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.render('view_complaints', { complaints });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).send('Error fetching complaints');
  }
});

// Admin: Reply to a complaint
router.post('/reply/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const { reply } = req.body;
    await Complaint.findByIdAndUpdate(req.params.id, { reply, status: 'resolved' });
    res.redirect('/complaints');
  } catch (error) {
    console.error('Error replying to complaint:', error);
    res.status(500).send('Error replying to complaint');
  }
});

// User: Submit a complaint
router.get('/submit', authMiddleware('user'), (req, res) => {
  res.render('complaints');
});

router.post('/submit', authMiddleware('user'), async (req, res) => {
  try {
    const complaint = new Complaint({
      userId: req.session.user._id,
      description: req.body.description,
    });
    await complaint.save();
    res.redirect('/dashboard_user');
  } catch (error) {
    res.status(500).send('Error submitting complaint');
  }
});

module.exports = router;
