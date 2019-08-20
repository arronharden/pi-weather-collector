const collectors = require('./collectors')
const postgresClient = require('./persistence/postgres-client')

function init () {
  return postgresClient.init()
    .then(() => collectors.init())
    .then((collectorInsts) => {
      console.log(`Initialised collector instances ${JSON.stringify(collectorInsts)}.`)

      // for each instance do an initial collect and write (will also set a timer to repeat)
      return collectorInsts.map((collectorInst) => collectAndWrite(collectorInst))
    })
    .catch((err) => {
      console.log(`Initialisation error: ${err}.`, err)
    })
}

function collectAndWrite (collectorInstance) {
  return collect(collectorInstance)
    .then((data) => {
      if (!data) {
        console.log(`No data for collector ${collectorInstance.alias} - skipping`)
      } else {
        return write(data)
      }
    })
    .then(() => {
      // Set another timer for this collector instance
      setTimeout(() => { collectAndWrite(collectorInstance) }, collectorInstance.period)
    })
}

function collect (collectorInstance) {
  return collectorInstance.collector.collect()
    .catch((err) => {
      console.log(`Collect error: ${err}.`, err)
    })
}

function write (data) {
  return postgresClient.write(data)
    .then((result) => {
      console.log(`Wrote measurement ${JSON.stringify(result.rows[0])}`)
    })
    .catch((err) => {
      console.log(`Write error: ${err}.`, err)
    })
}

// start everything..
init()
