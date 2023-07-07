'use strict';

const getMonday = (date) => {
  const millisecondsToSubtract = ((date.getDay() + 6) % 7) * 24 * 60 * 60 * 1000;
  const newDate = new Date(date.getTime() - millisecondsToSubtract);
  return newDate;
};

module.exports = getMonday;
