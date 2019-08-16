const sensor = require('node-dht-sensor').promises

const options = {
  dhtType: 11, // 11 or 22
  pin: 4
}

module.exports.getType = () => 'dht'

module.exports.init = (instanceName) => {
  // No-op
}

module.exports.collect = (instanceName) => {
  /*
  Read DHTxx sensor data. Promise resolved with:
  {
    "temperature_C": 32,
    "humidity": 34
  }
  */
  return sensor.read(options.dhtType, options.pin)
    .then(({ temperature, humidity }) => {
      // Normalise
      return {
        temperature_C: temperature.toFixed(1),
        humidity: humidity.toFixed(1)
      }
    })
}
