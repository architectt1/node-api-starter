const mongoose = require('mongoose');
const { setupSchema } = require('../helpers/model.helper');

const Schema = mongoose.Schema;

const PersonSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: Date, required: true }
}, { versionKey: false });

module.exports = setupSchema('Person', PersonSchema);
