const collectors = require('./collectors')
const postgresClient = require('./persistence/postgres-client')
const fs = require('fs')

function init () {
  console.log(`Process starting with PID ${process.pid}`)
  fs.writeFile('./.pwc.pid', process.pid, function (err) {
    if (err) {
      console.error(`Failed to write PID file: ${err}`, err)
    }
  })

  // add some exit handlers
  process.on('exit', function () {
    console.log(`Exit handler - process ${process.pid} finishing.`)
  })
  process.on('SIGINT', function () {
    // catch ctrl+c event and exit normally
    console.log(`SIGINT (ctrl-c) caught in process ${process.pid}.`)
    process.exit(0)
  })
  process.on('uncaughtException', function (e) {
    // catch uncaught exceptions
    console.error(`Uncaught exception in process ${process.pid}: ${e}.`, e)
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
}
function _timeoutPromise (req, timeoutMS, promise, msg) {
  if (!timeoutMS) {
    return promise
  }
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(function () {
      const err = errorUtil.createInternalError(messages.AIQCU0023E,
        [`Time out of ${timeoutMS}ms exceded. msg=${msg}`],
        req, messages.getMessageDetails)
      reject(err)
    }, timeoutMS)
  })
  return Promise.race([promise, timeoutPromise])
}

function collectAndWrite (collectorInstance) {
  console.log(`Collecting measurements for ${collectorInstance.alias}`)
  return collect(collectorInstance, 5, 5000)
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

function collect (collectorInstance, numRetries, retryDelayMS) {
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(function () {
      reject(new Error(`Timeout waiting for collector ${collectorInstance.alias} to respond.`))
    }, 5000)
  })
  const collectPromise = collectorInstance.collector.collect()
  return Promise.race([collectPromise, timeoutPromise])
    .catch((err) => {
      // collect failed (or timed out), if allowed retry again after waiting for the retryDelay
      if (numRetries > 0) {
        return new Promise((resolve, reject) => {
          setTimeout(function () {
            console.warn(`Collect error: [${err}]. Retrying again now. numRetries=${numRetries - 1}`, err)
            collect(collectorInstance, numRetries - 1, retryDelayMS).then(resolve, reject)
          }, retryDelayMS)
        })
      }
      console.error(`Giving up collection after all retries exhausted: ${err}`, err)
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
  .catch((err) => {
    console.error(`Initialisation error: ${err}.`, err)
    process.exit(20)
  })

// run forever..
var done = (function wait () { if (!done) setTimeout(wait, 1000) })()
