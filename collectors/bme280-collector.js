const BME280 = require('bme280-sensor')

class BME280Collector {
  constructor (alias, config) {
    this.alias = alias
    this.bme280 = new BME280(config)
  }

  collect () {
    // Read BME280 sensor data
    return this.bme280.readSensorData()
      .then((data) => ({
        // Normalise
        alias: this.alias,
        type: this.getType(),
        timestamp: (new Date()).toISOString(),
        temperature: data.temperature_C,
        humidity: data.humidity,
        pressure: data.pressure_hPa
      }))
  }

  getType () {
    return __filename.slice(__dirname.length + 1, -3)
  }

  init () {
    // Initialize the BME280 sensor
    return this.bme280.init()
  }
}

module.exports.create = (config) => new BME280Collector(config)
