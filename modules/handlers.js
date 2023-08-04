"use strict";

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

    //Replace oldPlant with newPlant, or if newPlant is "", delete oldPlant
    week.plants = req.body.newPlant
      ? week.plants.map((p) => (p === req.params.plant ? req.body.newPlant : p))
      : week.plants.filter((p) => p !== req.params.plant);

    week.plants = week.plants.filter((p) => p !== "");
    await week.save();
    res.status(200).send(week);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = Handler;
