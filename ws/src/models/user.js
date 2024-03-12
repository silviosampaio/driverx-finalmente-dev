const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const generate = require('gerador-validador-cpf').generate;

const user = new Schema({
  fbId: { type: String, required: true },
  nome: { type: String, required: true },
  email: { type: String, required: true },
  cpf: {
    type: String,
    default: () => {
      return generate();
    },
  },
  tipo: {
    type: String,
    enum: ['M', 'P'],
    required: true,
  },
  accessToken: { type: String, required: true },
  recipientId: {
    type: String,
    required: function () {
      return this.tipo === 'M';
    },
  },
  location: {
    type: { type: String },
    coordinates: [],
  },
  socketId: String,
  dataCadastro: {
    type: Date,
    default: Date.now(),
  },
});

user.index({ location: '2dsphere' });

module.exports = mongoose.model('User', user);
