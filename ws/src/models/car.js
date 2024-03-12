const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const car = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  placa: { type: String, required: true },
  marca: { type: String, required: true },
  modelo: { type: String, required: true },
  cor: { type: String, required: true },
  register: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Car', car);
