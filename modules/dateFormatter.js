function getMonday(date) {
  const millisecondsToSubtract = ((date.getDay() + 6) % 7) * 24 * 60 * 60 * 1000;
  const newDate = new Date(date.getTime() - millisecondsToSubtract);

  const year = newDate.getFullYear();
  const month = newDate.getMonth() + 1;
  const day = newDate.getDate();

  return month + '-' + day + '-' + year;
}

function getPreviousWeekDates(startDate, numOfDates) {
  const dates = [];
  startDate = new Date(startDate);
  dates.push(formatDate(startDate));

  for(let i=1; i <= numOfDates-1; i++) {
    const millisecondsToSubtract = i * 7 * 24 * 60 * 60 * 1000;
    const newDate = new Date(startDate.getTime() - millisecondsToSubtract);

    const formattedDate = formatDate(newDate);
    dates.push(formattedDate);
  }

  return dates;
}

function formatDate(date) {
  return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
}

module.exports = {getMonday, getPreviousWeekDates};

