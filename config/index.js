
const GLOBAL_CONFIG_FILE = './app-config.json'
const ENV_CONFIG_FILE = `./app-config-${process.env.APP_CONFIG}.json`

const globalAppConfig = require(GLOBAL_CONFIG_FILE)

// Try env specific config
let cfg = globalAppConfig
try {
  cfg = require(ENV_CONFIG_FILE)
  console.info(`Using env config from ${ENV_CONFIG_FILE}`)
} catch (err) {
  // doesn't exist - ignore and use global config
  console.error(err)
  console.info(`Using global config from ${GLOBAL_CONFIG_FILE}`)
}

module.exports = cfg
