const config = require('config');
const mongoose = require('mongoose');

const mongodbUri = config.get('mongodbUri');

module.exports = async function () {
  await mongoose.connect(mongodbUri)
  if (['true', true].indexOf(config.dropDb) === -1) {
    return;
  }
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map(collection => collection.deleteMany({})));
};
