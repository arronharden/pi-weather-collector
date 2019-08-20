const BME280 = require('bme280-sensor')

class BME280Collector {
  constructor (alias, config) {
    this.alias = alias
    const normConfig = Object.assign({}, config)
    if (typeof normConfig.i2cAddress === 'string') {
      normConfig.i2cAddress = parseInt(normConfig.i2cAddress)
    }
    this.bme280 = new BME280(normConfig)
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

module.exports.create = (alias, config) => new BME280Collector(alias, config)
