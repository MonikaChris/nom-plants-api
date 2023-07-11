'use strict';

const getMonday = require('./dateFormatter');

const Week = require('../models/week');

const Handler = {};

Handler.getWeek = async (req, res, next) => {
  console.log(`Date Format: ${req.query.date}`);
  // const date = new Date(req.query.date);
  // const monday = getMonday(date);
  // console.log(`Monday: ${monday}`);
  // console.log('hello');

  try {
    const weeks = await Week.find({date: req.query.date});
    res.status(200).send(weeks);
  } catch (error) {
    console.error(error);
    next(error);
  }
};


Handler.addPlant = async (req, res, next) => {
  // Normalize date - every week is indexed by Monday
  const date = new Date(req.body.date);
  const monday = getMonday(date);
  const week = await Week.findOne({date: monday});

  //If week exists update with new plant, else create new week with first plant
  if (week) {
    week.plants.push(req.body.plants);
    try {
      const updatedWeek = await Week.findByIdAndUpdate(week.id, week, {new: true});
      res.status(200).send(updatedWeek);
    } catch(error) {
      console.error(error);
      next(error);
    }
  } else {
    try {
      // Normalize date
      //req.body.date = monday;

      const newWeekData = {
        date: monday,
        plants: req.body.plants,
        email: req.body.email
      };

      // Create new week entry
      const newWeek = await Week.create(newWeekData);
      res.status(200).send(newWeek);
    } catch(error) {
      console.error(error);
      next(error);
    }
  }
};

module.exports = Handler;
