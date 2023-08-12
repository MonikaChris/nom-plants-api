"use strict";
const plantData = require('./data/plantsData.js');

const getMonday = require("./dateFormatter");
const Week = require("../models/week");

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

  // No duplicate plants
  if (week.plants.includes(req.params.plant)) {
    return res.status(409).send("Plant already exists");
  }

  try {
    if (week) {
      week.plants.push(req.params.plant);
      await week.save();
      res.status(200).send(week);
    } else {
      const newWeek = {
        date: monday,
        plants: req.params.plant,
        email: req.body.email,
      };
      const createdWeek = await Week.create(newWeek);
      res.status(201).send(createdWeek);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

Handler.updatePlant = async (req, res, next) => {
  try {
    let week = await Week.findOne({ date: req.params.weekStartDate });

    if (!week) {
      res.status(404).send("Week not found");
      return;
    }

    if (req.body.newPlant) {
      week.plants = week.plants.map((plant) =>
        plant === req.params.plant ? req.body.newPlant : plant
      );
    } else {
      week.plants = week.plants.filter((plant) => plant !== req.params.plant);
    }

    await week.save();
    res.status(200).send(week);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

Handler.getDemoData = (req, res) => {
  const date = req.params.date;
  const numOfDates = 5;

  const dates= getWeekDates(date, numOfDates);

  const dateObjs = dates.map(date, idx => {
    const dateObj = {date, plants: [], email: 'lovebug@veggies.com'};
    dateObj.plants = plantData[idx];
    return dateObj;
  });

  res.status(200).send(dateObjs);
};

module.exports = Handler;
