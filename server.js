'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();

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

