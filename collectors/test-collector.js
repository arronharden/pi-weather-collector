class TestCollector {
  constructor (alias, config) {
    this.alias = alias
    this.config = config
    this.last = {
      temperature: 32.09,
      humidity: 34.851083883116694,
      pressure: 1010.918480644477
    }
  }

  collect () {
    // Generate dummy data
    const next = {
      alias: this.alias,
      type: this.getType(),
      timestamp: (new Date()).toISOString(),
      temperature: this._getNext(this.last.temperature, 1, -10, 40),
      humidity: this._getNext(this.last.humidity, 2, 0, 100),
      pressure: this._getNext(this.last.pressure, 50, 800, 1200)
    }
    this.last = next
    return Promise.resolve(next)
  }

  getType () {
    return __filename.slice(__dirname.length + 1, -3)
  }

  init () {
    // No-op
    return Promise.resolve()
  }

  _getNext (current, maxChange, min, max) {
    const delta = (Math.random() * maxChange) - (maxChange / 2)
    const next = Math.min(max, Math.max(min, current + delta))
    return next
  }
}

module.exports.create = (alias, config) => new TestCollector(alias, config)
