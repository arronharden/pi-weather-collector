
const INSTANCES = [/* {
  name: 'bme280-0',
  period: 2000,
  collector: require('./bme280-collector')
}, */
  {
    name: 'test-0',
    period: 2000,
    collector: require('./test-collector')
  }]

module.exports.init = () => {
  // initialise each enabled collector instance
  const proms = INSTANCES.map((inst) => inst.collector.init(inst.name))
  return Promise.all(proms)
    .then((results) => {
      const enabledInstances = []
      for (var idx = 0; idx < results.length; idx++) {
        const enabled = Object.assign({ type: INSTANCES[idx].collector.getType() }, INSTANCES[idx])
        delete enabled.collector
        enabledInstances.push(enabled)
        console.log(`Initialised collector instance ${JSON.stringify(enabled)}.`)
      }
      return INSTANCES
    })
    .catch((err) => {
      console.log(`Initialisation error: ${err}.`, err)
    })
}

module.exports.collect = (name) => {
  // invoke the specified collector instance
  const insts = INSTANCES.filter((inst) => { return inst.name === name })
  if (!insts || insts.length === 0) {
    return Promise.reject(new Error(`Collector instance ${name} could not be found`))
  }
  if (insts.length > 1) {
    return Promise.reject(new Error(`More than 1 collector instance defined with an name of ${name}`))
  }
  return insts[0].collector.collect(name)
    .then((data) => {
      /* normalise the data with name, type and timestamp, to end up with:
      {
        "name": <name>,
        "type": <collectorType>,
        "timestamp": <Date>,
        "temperature_C": 32.09,
        "humidity": 34.851083883116694,
        "pressure_hPa": 1010.918480644477
      }
      */
      return Object.assign({
        name: name,
        type: insts[0].collector.getType(),
        timestamp: new Date() },
      data)
    })
    .catch((err) => {
      console.log(`Collect error for instance ${name}: ${err}`, err)
    })
}
