const collectors = require('./collectors')
const postgresClient = require('./persistence/postgres-client')

function init () {
  console.log(`Process starting on PID ${process.pid}`)

  // add some exit handlers
  process.on('exit', function () {
    console.log('Exit handler - process finishing.')
  })
  process.on('SIGINT', function () {
    // catch ctrl+c event and exit normally
    console.log('SIGINT (ctrl-c) caught.')
    process.exit(0)
  })
  process.on('uncaughtException', function (e) {
    // catch uncaught exceptions
    console.error(`Uncaught exception ${e}.`, e)
    process.exit(99)
  })

  return postgresClient.init() // init postgress
    .then(() => collectors.init()) // init the collectors
    .then((collectorInsts) => {
      collectorInsts.forEach((inst) => {
        const info = Object.assign({}, {
          alias: inst.alias,
          period: inst.period,
          type: inst.collector.getType()
        })
        console.log(`Initialised collector instance ${JSON.stringify(info)}.`)
      })

      // for each instance do an initial collect and write (will also set a timer to repeat)
      return collectorInsts.map((collectorInst) => collectAndWrite(collectorInst))
    })
    .catch((err) => {
      console.error(`Initialisation error: ${err}.`, err)
    })
}

function collectAndWrite (collectorInstance) {
  console.log(`Collecting measurements for ${collectorInstance.alias}`)
  return collect(collectorInstance)
    .then((data) => {
      if (!data) {
        console.log(`No measurements for collector ${collectorInstance.alias} - skipping`)
      } else {
        return write(data)
      }
    })
    .then(() => {
      // Set another timer for this collector instance
      console.log(`Next collection of ${collectorInstance.alias} measurements will be in ${collectorInstance.period / 1000}s`)
      setTimeout(() => { collectAndWrite(collectorInstance) }, collectorInstance.period)
    })
}

function collect (collectorInstance) {
  return collectorInstance.collector.collect()
    .catch((err) => {
      console.error(`Collect error: ${err}.`, err)
    })
}

function write (data) {
  return postgresClient.write(data)
    .then((result) => {
      console.log(`Wrote measurement ${JSON.stringify(result.rows[0])}`)
    })
    .catch((err) => {
      // log and continue
      console.error(`Write error: ${err}.`, err)
    })
}

// start everything..
init()
