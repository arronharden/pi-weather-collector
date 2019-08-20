
const appConfig = require('../config/app-config.json')

function _createAndInit (defn) {
  const collectorType = require('./' + defn.type)
  const inst = {
    alias: defn.alias,
    period: defn.period,
    collector: collectorType.create(defn.alias, defn.config)
  }
  return inst.collector.init().then(() => inst)
}

module.exports.init = () => {
  // initialise each collector instance in the config
  const proms = appConfig.collectors.map((defn) => _createAndInit(defn))
  return Promise.all(proms)
}
