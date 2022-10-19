const { Schema, model, ObjectId } = require('mongoose');
const type = require('./types');

const Item = new Schema({
  name: { type: String, required: true },
  type: { type: String, enum: type.itemType, required: true },
  rare: {
    type: String,
    enum: type.rarity,
    required: true,
    default: type.rarity[0],
  },
  power: { type: Number, required: true, default: 1 },
  defence: { type: Number, required: true, default: 1 },
  magicDefence: { type: Number, required: true, default: 0 },
});

module.exports = model('Character', Item);
