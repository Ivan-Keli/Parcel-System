const express = require('express');
const Parcel = require('../models/Parcel');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid'); // Generate unique tracking IDs

// Admin: View all parcels
router.get('/', authMiddleware('admin'), async (req, res) => {
  try {
    const parcels = await Parcel.find();
    res.render('parcels', { parcels });
  } catch (error) {
    res.status(500).send('Error fetching parcels');
  }
});

// Admin: Add a parcel
router.post('/add', authMiddleware('admin'), async (req, res) => {
  try {
    const { sender, receiver, trackingId, destination, status } = req.body;
    const parcel = new Parcel({
      sender,
      receiver,
      destination,
      trackingId,
      status: status || 'Pending',
    });
    await parcel.save();
    res.status(201).send('Parcel added successfully');
  } catch (error) {
    res.status(500).send('Error adding parcel');
  }
});

// Admin: Update parcel status
router.post('/status/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    await Parcel.findByIdAndUpdate(req.params.id, { status });
    res.redirect('/parcels');
  } catch (error) {
    console.error('Error updating parcel status:', error);
    res.status(500).send('Error updating parcel status');
  }
});

// Admin: Update payment status
router.post('/payment/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    await Parcel.findByIdAndUpdate(req.params.id, { paymentStatus });
    res.redirect('/parcels');
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).send('Error updating payment status');
  }
});

// Admin: Search for Parcels
router.get('/search', authMiddleware('admin'), async (req, res) => {
  const query = req.query.q;
  try {
    const parcels = await Parcel.find({
      $or: [
        { sender: { $regex: query, $options: 'i' } },
        { receiver: { $regex: query, $options: 'i' } },
        { trackingId: { $regex: query, $options: 'i' } },
        { destination: { $regex: query, $options: 'i' } },
      ],
    });
    res.render('parcels', { parcels });
  } catch (error) {
    console.error('Error searching parcels:', error);
    res.status(500).send('Error searching parcels');
  }
});

// Admin: Edit Parcel Details
router.post('/edit/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const { sender, receiver, destination, fee, status, paymentStatus } = req.body;

    // Ensure fee is a number within the valid range
    if (fee < 200 || fee > 3500) {
      return res.status(400).send('Invalid fee amount');
    }

    await Parcel.findByIdAndUpdate(req.params.id, {
      sender,
      receiver,
      destination,
      fee, // Include fee in the update
      status,
      paymentStatus,
    });

    res.redirect('/parcels');
  } catch (error) {
    console.error('Error editing parcel:', error);
    res.status(500).send('Error editing parcel');
  }
});

// Admin: Delete a parcel
router.delete('/:id', authMiddleware('admin'), async (req, res) => {
  try {
    await Parcel.findByIdAndDelete(req.params.id);
    res.status(200).send('Parcel deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting parcel');
  }
});

// User: Render parcel creation form
router.get('/create', authMiddleware('user'), (req, res) => {
  res.render('create_parcel');
});

// User: Handle parcel creation
router.post('/create', authMiddleware('user'), async (req, res) => {
  try {
    const { sender, receiver, destination } = req.body;
    const trackingId = uuidv4();
    const fee = Math.floor(Math.random() * (3500 - 200 + 1)) + 200;

    const parcel = new Parcel({
      sender,
      receiver,
      destination,
      trackingId,
      userId: req.session.user._id,
      fee,
      status: 'Pending',
      paymentStatus: 'No',
    });

    await parcel.save();
    res.render('parcel_success', { trackingId, fee });
  } catch (error) {
    console.error('Error creating parcel:', error);
    res.status(500).send('Error creating parcel');
  }
});

// User: View their parcels
router.get('/mine', authMiddleware('user'), async (req, res) => {
  try {
    const parcels = await Parcel.find({ userId: req.session.user._id });
    res.render('user_parcels', { parcels });
  } catch (error) {
    res.status(500).send('Error fetching your parcels');
  }
});

// User: Render parcel tracking page
router.get('/track', authMiddleware('user'), (req, res) => {
  res.render('parcel_tracking', { parcel: null });
});

// User: Track a parcel by tracking ID
router.post('/track', authMiddleware('user'), async (req, res) => {
  try {
    const { trackingId } = req.body;
    const parcel = await Parcel.findOne({ trackingId });
    if (parcel) {
      res.render('parcel_tracking', { parcel });
    } else {
      res.render('parcel_tracking', { parcel: null, error: 'Parcel not found' });
    }
  } catch (error) {
    res.status(500).send('Error tracking parcel');
  }
});

module.exports = router;
