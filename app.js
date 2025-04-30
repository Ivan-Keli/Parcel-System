const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const authMiddleware = require('./middleware/authMiddleware');
const errorMiddleware = require('./middleware/errorMiddleware');

// Import Controllers
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const parcelController = require('./controllers/parcelController');
const complaintController = require('./controllers/complaintController');
const reportController = require('./controllers/reportController');

const User = require('./models/User');
const Parcel = require('./models/Parcel');
const Complaint = require('./models/Complaint');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('index'); // Render the home page
});

app.get('/login', (req, res) => {
  res.render('login'); // Render the login page
});

app.get('/register', (req, res) => {
  res.render('register'); // Render the registration page
});

// Logout Route
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/login'); // Redirect to login page after logout
  });
});

// Admin Dashboard
app.get('/dashboard_admin', authMiddleware('admin'), async (req, res) => {
  try {
    // Fetch data from the database
    const totalUsers = await User.countDocuments();
    const totalParcels = await Parcel.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
    const awaitingPayment = await Parcel.countDocuments({ paymentStatus: 'No' }); // Fetch parcels awaiting payment

    res.render('dashboard_admin', {
      totalUsers,
      totalParcels,
      pendingComplaints,
      awaitingPayment, // Pass to EJS
    });
  } catch (error) {
    console.error('Error loading admin dashboard:', error);
    res.status(500).send('Error loading admin dashboard');
  }
});

// User Dashboard
app.get('/dashboard_user', authMiddleware('user'), async (req, res) => {
  try {
    const userId = req.session.user._id;

    // Fetch user-specific data
    const parcels = await Parcel.find({ userId });
    const complaints = await Complaint.find({ userId });

    // Count parcel statuses
    const pendingParcels = parcels.filter(parcel => parcel.status === 'pending').length;
    const inTransitParcels = parcels.filter(parcel => parcel.status === 'in transit').length;
    const deliveredParcels = parcels.filter(parcel => parcel.status === 'delivered').length;
    const awaitingPayment = parcels.filter(parcel => parcel.paymentStatus === 'No').length;

    res.render('dashboard_user', {
      parcels,
      complaints,
      pendingParcels,
      inTransitParcels,
      deliveredParcels,
      awaitingPayment, // Pass to EJS
    });
  } catch (error) {
    console.error('Error loading user dashboard:', error);
    res.status(500).send('Error loading user dashboard');
  }
});

// Render Parcel Tracking Page
app.get('/parcels/track', authMiddleware('user'), (req, res) => {
  res.render('parcel_tracking', { parcel: null }); // Render tracking page with an empty parcel
});

// Render Complaint Submission Page
app.get('/complaints/submit', authMiddleware('user'), (req, res) => {
  res.render('complaints'); // Render complaints submission page
});

// Admin: Update Payment Status Route
app.post('/parcels/payment/:id', authMiddleware('admin'), async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    await Parcel.findByIdAndUpdate(req.params.id, { paymentStatus });
    res.redirect('/parcels'); // Redirect back to parcels view
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).send('Error updating payment status');
  }
});

// Controllers
app.use('/auth', authController);
app.use('/users', authMiddleware('admin'), userController);
app.use('/parcels', parcelController);
app.use('/complaints', complaintController);
app.use('/reports', authMiddleware('admin'), reportController);
app.use(express.static(path.join(__dirname, 'public')));

// Error Handling Middleware
app.use(errorMiddleware);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
