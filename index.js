
// const { fetchMyIP } = require('./iss');
// const { fetchCoordsByIP } = require('./iss');
// const { fetchISSFlyOverTimes } = require('./iss');
const { nextISSTimesForMyLocation } = require('./iss');


// //IP FETCHING
// fetchMyIP((error, ip) => {
//   if (error) {
//     console.log(`Couldn't find your IP`, error);
//     return;
//   }
//   console.log(`It worked! returned IP:`, ip);
// });



// // const stringIP = '104.157.8.218';
// //GEO COORDINATE FETCHING

// fetchCoordsByIP(fetchMyIP, (error, data) => {
//   console.log(fetchMyIP)
//   if (error) {
//     console.log(`couldn't find your GEOLOCATION`, error);
//     return;
//   }
//   console.log(`returned coordinates`, data);
// });


// const coords = { latitude: '51.3062', longitude: '-114.0394' }
//ISS FLYOVER FETCHING
// fetchISSFlyOverTimes((error, data) => {
//   if (error) {
//     console.log(`Couldn't find the passover times`, error);
//     return;
//   }
//   console.log(`returned coordinates`, data);

// });

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};


nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});

// http://ip-api.com/json/104.157.8.218