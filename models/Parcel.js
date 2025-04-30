const mongoose = require('mongoose');

const parcelSchema = new mongoose.Schema({
  sender: { type: String, required: true }, // Name of the sender
  receiver: { type: String, required: true }, // Name of the receiver
  trackingId: { type: String, required: true, unique: true }, // Unique tracking ID
  destination: { type: String, required: true }, // Destination of the parcel
  status: { 
    type: String, 
    enum: ['Pending', 'In Transit', 'Delivered', 'Flagged'], 
    default: 'Pending' 
  }, // Status of the parcel
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who created the parcel
  fee: { 
    type: Number, 
    required: true, 
    min: 200, 
    max: 3500 
  }, // Delivery fee with validation
  paymentStatus: { 
    type: String, 
    enum: ['No', 'Yes'], 
    default: 'No' 
  }, // Payment status
  createdAt: { type: Date, default: Date.now }, // Date and time of parcel creation
});

module.exports = mongoose.model('Parcel', parcelSchema);
