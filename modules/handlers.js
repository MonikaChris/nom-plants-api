"use strict";
const plantData = require("../data/plantsData.js");
const { getMonday, getPreviousWeekDates } = require("./dateFormatter");
const Week = require("../models/Week.js");

const Handler = {};

Handler.getWeek = async (req, res, next) => {
  try {
    const week = await Week.findOne({ username: req.user, date: req.params.weekStartDate });
    res.status(200).send(week);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

Handler.addPlant = async (req, res, next) => {
  // Normalize date - every week is indexed by Monday
  const monday = getMonday(new Date(req.params.weekStartDate));

  try {
    let week = await Week.findOne({ username: req.user, date: monday });

    if (week) {
      // No duplicate plants
      if (week.plants.includes(req.params.plant)) {
        return res.status(409).send("Plant already exists");
      }
      week.plants.push(req.params.plant);
      await week.save();
    } else {
      week = new Week({
        date: monday,
        plants: req.params.plant,
        username: req.user,
      });
      await week.save();
    }
    res.status(201).send(week);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

Handler.updatePlant = async (req, res, next) => {
  try {
    let week = await Week.findOne({ username: req.user, date: req.params.weekStartDate });

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
  const startDate = req.params.date;
  const numOfDates = 5;

  const dates = getPreviousWeekDates(startDate, numOfDates);

  const dateObjs = dates.map((date, idx) => {
    const dateObj = { date, plants: [], username: "lovebug@veggies.com" };
    dateObj.plants = plantData[idx];
    return dateObj;
  });

  res.status(200).send(dateObjs);
};

module.exports = Handler;
