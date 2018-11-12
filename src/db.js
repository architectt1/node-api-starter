const config = require('config');
const mongoose = require('mongoose');

const mongodbUri = config.get('mongodbUri');

module.exports = async function () {
  return mongoose.connect(mongodbUri);
};
