module.exports.getType = () => 'test'

module.exports.init = (instanceName) => {
  // Initialize the BME280 sensor
  return Promise.resolve()
}

module.exports.collect = (instanceName) => {
  /*
  Generate dummy data. Promise resolved with:
  {
    "temperature_C": 32.09,
    "humidity": 34.851083883116694,
    "pressure_hPa": 1010.918480644477
  }
  */
  return Promise.resolve({
    temperature_C: 32.09,
    humidity: 34.851083883116694,
    pressure_hPa: 1010.918480644477
  })
}
