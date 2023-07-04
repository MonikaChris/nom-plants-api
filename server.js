'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose is connected to Atlas!');
});

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3002;

// Home/test route
app.get('/', (req, res) => {
  res.send('Testing...');
});

app.use((error, req, res, next) => {
  res.status(500).send(error.message);
});

app.listen(PORT, console.log(`Listening...`));

