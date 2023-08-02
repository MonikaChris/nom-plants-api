'use strict';

const getMonday = require('./dateFormatter');
const Week = require('../models/week');

const Handler = {};

Handler.getWeek = async (req, res, next) => {
  try {
    const week = await Week.findOne({ date: req.params.weekStartDate });
    res.status(200).send(week);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

Handler.addPlant = async (req, res, next) => {
  // Normalize date - every week is indexed by Monday
  const date = new Date(req.params.weekStartDate);
  const monday = getMonday(date);
  const week = await Week.findOne({ date: monday });

  //If week exists update with new plant, else create new week with first plant
  if (week) {
    week.plants.push(req.params.plant);
    try {
      const updatedWeek = await Week.findByIdAndUpdate(week.id, week, {
        new: true,
      });
      res.status(200).send(updatedWeek);
    } catch (error) {
      console.error(error);
      next(error);
    }
  } else {
    try {
      // Normalize date
      //req.body.date = monday;

      const newWeekData = {
        date: monday,
        plants: req.params.plant,
        email: req.body.email,
      };

      // Create new week entry
      const newWeek = await Week.create(newWeekData);
      res.status(200).send(newWeek);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
};

Handler.updatePlant = async (req, res, next) => {
  try {
    let plantWeek = await Week.findOne({ date: req.body.date });

    if (!plantWeek) {
      res.status(404).send('Week not found');
      return;
    }

    //Replace oldPlant with newPlant, or if newPlant is "", delete oldPlant
    plantWeek.plants = req.body.newPlant
      ? plantWeek.plants.map((plant) =>
        plant === req.body.oldPlant ? req.body.newPlant : plant
      )
      : plantWeek.plants.filter((plant) => plant !== req.body.oldPlant);

    await plantWeek.save();
    res.status(200).send(plantWeek);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = Handler;
