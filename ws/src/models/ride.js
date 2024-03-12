const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ride = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  driverId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  info: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    enum: ['A', 'C', 'F'], // ACTIVE, CANCELED, FINISHED,
    default: 'A',
  },
  transactionId: {
    type: String,
    required: true,
  },
  register: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Ride', ride);
