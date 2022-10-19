const { Schema, model, ObjectId } = require('mongoose');
const type = require('./types');

const User = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  character: {
    lvl: { type: Number },
    gender: { type: String, enum: type.gender },
    race: { type: String, enum: type.race },
    role: { type: String, enum: type.role },
    equipment: { type: ObjectId, ref: 'Item' },
    inventory: { type: ObjectId, ref: 'Item' },
  },
  isBanned: { type: Boolean, default: false },
});

module.exports = model('User', User);
