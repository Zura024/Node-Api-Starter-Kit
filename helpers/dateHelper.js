function getFolderDate(date = new Date()) {
  let day = date.getDate();
  let month = date.getMonth() + 1; //January is 0!
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();

  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (hours < 10) {
    hours = '0' + hours;
  }
  return `${year}${month}${day}${hours}${minutes}`;
}

module.exports = {
  getFolderDate: getFolderDate
};
