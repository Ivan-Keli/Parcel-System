const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // References the user who made the complaint
  description: { type: String, required: true }, // Complaint description, now required
  status: { type: String, enum: ['pending', 'resolved'], default: 'pending' }, // Status of the complaint
  reply: { type: String, default: '' }, // Admin's reply to the complaint
  createdAt: { type: Date, default: Date.now }, // Timestamp for when the complaint was created
});

module.exports = mongoose.model('Complaint', complaintSchema);
