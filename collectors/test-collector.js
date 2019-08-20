class TestCollector {
  constructor (alias, config) {
    this.alias = alias
    this.config = config
  }

  collect () {
    // Generate dummy data
    return Promise.resolve({
      alias: this.alias,
      type: this.getType(),
      timestamp: (new Date()).toISOString(),
      temperature: 32.09,
      humidity: 34.851083883116694,
      pressure: 1010.918480644477
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

module.exports.create = (alias, config) => new TestCollector(alias, config)
