const mongoose = require('mongoose');
const { MongooseAutoIncrementID } = require('mongoose-auto-increment-reworked');

const modelHelper = module.exports;

/**
 * Makes final adjustments to models: auto increment of "_id" field as a number, replaces the "_id" field by an "id"
 * field when calling the toJSON method of instances of these schemas, and finally registers it with mongoose.
 * @param schemaName
 * @param schema
 * @returns {Model<Document>}
 */
modelHelper.setupSchema = (schemaName, schema) => {
  new MongooseAutoIncrementID(schema, schemaName).applyPlugin();
  schema.set('toJSON', {
    transform: function (doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
    }
  });

  return mongoose.model(schemaName, schema);
};
