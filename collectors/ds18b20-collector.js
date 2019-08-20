const sensor = require('ds18b20-raspi')

class DS18B20Collector {
  constructor (alias, config) {
    this.alias = alias
    this.config = config
  }

  collect () {
    // Read DS18B20 sensor data
    return new Promise((resolve, reject) => {
      const deviceId = this.config.deviceId
      if (deviceId) {
        // read specific sensor
        sensor.readC(deviceId, (err, temp) => {
          if (err) {
            reject(new Error(`Failed to read sensor data for deviceId=${deviceId}: ${err}`))
            return
          }
          resolve({
            // Normalise
            alias: this.alias,
            type: this.getType(),
            timestamp: (new Date()).toISOString(),
            temperature: temp
          })
        })
      } else {
        // expect only a single sensor
        sensor.readSimpleC((err, temp) => {
          if (err) {
            reject(new Error(`Failed to read sensor data: ${err}`))
            return
          }
          resolve({
            // Normalise
            alias: this.alias,
            type: this.getType(),
            timestamp: (new Date()).toISOString(),
            temperature: temp
          })
        })
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

module.exports.create = (alias, config) => new DS18B20Collector(alias, config)
