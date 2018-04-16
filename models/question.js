'use strict';
const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  question: { type: String, required: true},
  dragonAnswer: { type: String, required: true},
  answer: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  correctAttempts: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  mValue: { type: Number, default: 1}
});

questionSchema.set('toObject', {
  transform: function(doc, ret) {
    delete ret.password;
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = { Question };
