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

// Handler.addPlant = async (req, res, next) => {
//   try {
//     const { date, plants, email } = req.body;
//     const newWeek = new Week({ date, plants, email });
//     const week = await newWeek.save();
//     res.status(200).send(week);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };

Handler.addPlant = async (req, res, next) => {
  const week = await Week.findOne({date: req.body.date});

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
      const newWeek = await Week.create(req.body);
      res.status(200).send(newWeek);
    } catch(error) {
      console.error(error);
      next(error);
    }
  }
};

module.exports = Handler;
