'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const Handler = require('./modules/handlers');

mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Mongoose is connected to Atlas!');
});

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

// Home/test route
app.get('/', (req, res) => {
  res.send('Testing...');
});

//Routes
app.get('/week', Handler.getWeek);
app.post('/plant', Handler.addPlant);
app.post('/update_plants', Handler.updatePlants);

app.use((error, req, res, next) => {
  res.status(500).send(error.message);
});

app.listen(PORT, console.log(`Listening...`));

