const express = require('express');
const Parcel = require('../models/Parcel');
const router = express.Router();

// Generate parcel report
router.get('/generate', async (req, res) => {
  try {
    const parcels = await Parcel.find();
    res.json({ totalParcels: parcels.length });
  } catch (error) {
    res.status(500).send('Error generating report');
  }
});

module.exports = router;
