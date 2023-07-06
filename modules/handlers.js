'use strict';

const Week = require('../models/week');

const Handler = {};

Handler.getWeeks = async (req, res, next) => {
  try {
    const weeks = await Week.find({});
    res.status(200).send(weeks);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

Handler.addPlant = async (req, res, next) => {
  try {
    const newWeek = new Week(req.body);
    const week = await newWeek.save();
    res.status(200).send(week);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = Handler;
