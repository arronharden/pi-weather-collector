const collectors = require('./collectors')

var initComplete = false

function init () {
  return collectors.init()
    .then((enabledInstances) => {
      console.log('All collectors initialised.')

      // for each instance do an initial collect and write (will also set a timer to repeat)
      enabledInstances.forEach((inst) => collectAndWrite(inst))

      initComplete = true
    })
}

function collectAndWrite (collectorInstance) {
  return collect(collectorInstance)
    .then((data) => {
      if (data) {
        return write(collectorInstance, data)
      }
    })
    .then(() => {
      // Set another timer for this instance
      setTimeout(() => { collectAndWrite(collectorInstance) }, collectorInstance.period)
    })
}

function collect (collectorInstance) {
  console.log(`Collecting from instance ${collectorInstance.name}.`)
  return collectors.collect(collectorInstance.name)
    .then((data) => {
      if (!data) {
        console.log(`No data for instance ${collectorInstance.name} - skipping`)
      } else {
        console.log(`Data for instance ${collectorInstance.name} is ${JSON.stringify(data)}`)
        return data
      }
    })
    .catch((err) => {
      console.log(`Collect error: ${err}.`, err)
    })
}

function write (collectorInstance, result) {
  console.log(`Writing ${JSON.stringify(result)} from instance ${collectorInstance.name}.`)
  return Promise.resolve()
    .catch((err) => {
      console.log(`Write error: ${err}.`, err)
    })
}

init()
setTimeout(() => {
  if (!initComplete) {
    console.log('Init did not complete with 30s - exiting')
    process.exit(20)
  }
}, 30 * 1000) // 30s
