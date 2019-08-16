const BME280 = require('bme280-sensor')

// The BME280 constructor options are optional.
const options = {
  i2cBusNo: 1, // defaults to 1
  i2cAddress: BME280.BME280_DEFAULT_I2C_ADDRESS() // defaults to 0x77
}
const bme280 = new BME280(options)

module.exports.getType = () => 'bme280'

module.exports.init = (instanceName) => {
  // Initialize the BME280 sensor
  return bme280.init()
}

module.exports.collect = (instanceName) => {
  /*
  Read BME280 sensor data. Promise resolved with:
  {
    "temperature_C": 32.09,
    "humidity": 34.851083883116694,
    "pressure_hPa": 1010.918480644477
  }
  */
  return bme280.readSensorData()
}
