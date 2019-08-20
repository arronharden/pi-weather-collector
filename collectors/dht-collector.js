const sensor = require('node-dht-sensor').promises

class DHTCollector {
  constructor (alias, config) {
    this.alias = alias
    this.config = config
  }

  collect () {
    // Read DHTxx sensor data
    return sensor.read(this.config.dhtType, this.config.pin)
      .then(({ temperature, humidity }) => {
        // Normalise
        return {
          alias: this.alias,
          type: this.getType(),
          timestamp: (new Date()).toISOString(),
          temperature: temperature,
          humidity: humidity
        }
      })
  }

  getType () {
    return __filename.slice(__dirname.length + 1, -3)
  }

  init () {
    // No-op
    return Promise.resolve()
  }
}

module.exports.create = (alias, config) => new DHTCollector(alias, config)
