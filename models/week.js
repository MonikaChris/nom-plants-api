'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const weekSchema = new Schema({
  date: String,
  plants: [String],
  email: String
});

const Week = mongoose.model('Week', weekSchema);

module.exports = Week;
