const request = require('request');

//fetch my IP
const fetchMyIP = (callback) => {
// console.log(`from fetch my ip`)
  const ipAPI = `https://api.ipify.org?format=json`;
  request(ipAPI, (error, response, body) => {
    let ip = JSON.parse(body);
    ip = ip.ip;

    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP. Response: ${body}`), null);
      return;
    }
    // console.log(`from fetch ip`, ip)
    return callback(null, ip);
  });
};

//fetch GEOCOORDINATES
const fetchCoordsByIP = (ip, callback) => {
  // console.log(`from fetch coords by ip`)
  const geoAPI = `http://ip-api.com/json/${ip}`;

  request(geoAPI, (error, response, body) => {
    const latitude = JSON.parse(body).lat;
    const longitude = JSON.parse(body).lon;

    if (error || JSON.parse(body).status === 'fail') {

      callback(error || JSON.parse(body).message, null);
      return;

    }

    if (response.statusCode !== 200) {

      callback(Error(`Status Code ${response.statusCode} when fetching Lat/Lon. Response: ${body}`), null);
      return;

    }
    if (latitude && longitude) {
      // console.log(`from fetchCoords`, { latitude, longitude })
      callback(null, { latitude, longitude });

    }
  });
};

// ISS FLYOVER TIMES
const fetchISSFlyOverTimes = (coords, callback) => {
  // console.log(`from fetch ISS fly over`)
  const issAPI = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  // console.log(`from inside fetchISS`)
  request(issAPI, (error, response, body) => {
    // console.log(`from inside request`)
    
    if (error) {
      callback(error, null);
      return;
    }
    
    let passes = JSON.parse(body).response;
    // console.log(response.statusCode)
    
    if (response.statusCode !== 200 || JSON.parse(body).message === 'fail') {
      
      callback(Error(`Status Code ${response.statusCode} when fetching ISS Passover. Response: ${body}`), null);
      return;
      
    }
    // console.log(`from issFlyover`, passes)
    callback(null, passes);
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results.
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */

const nextISSTimesForMyLocation = function(callback) {
  // console.log(`from next iss time for my location`)
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};


// TESTS
// fetchCoordsByIP('104.157.8.218')


// module.exports = { fetchMyIP };
// module.exports = { fetchCoordsByIP };
// module.exports = { fetchISSFlyOverTimes };
module.exports = { nextISSTimesForMyLocation };