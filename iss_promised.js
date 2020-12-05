const request = require('request-promise-native');

const fetchMyIP = () => {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = (body) => {
  const ip = JSON.parse(body).ip;
  return request(`http://ip-api.com/json/${ip}`);
};

const fetchISSFlyOverTimes = (body) => {
  // const { latitude, longitude } = JSON.parse(body).data;
  const latitude = JSON.parse(body).lat;
  const longitude = JSON.parse(body).lon;
  const url = `http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`;
  return request(url);
};

const printPassTimes = (passTimes) => {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

const nextISSTimesForMyLocation = () => {
  return fetchMyIP()
  .then(fetchCoordsByIP)
  .then(fetchISSFlyOverTimes)
  .then((data) => {
    const { response } = JSON.parse(data);
    return response;
  })
  .then(printPassTimes)
};

module.exports = { nextISSTimesForMyLocation };