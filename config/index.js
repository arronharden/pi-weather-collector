
const argv = require('yargs').argv

const GLOBAL_CONFIG_FILE = './app-config.json'
const APP_CONFIG_VALUE = (argv.app_config || process.env.APP_CONFIG)
const ENV_CONFIG_FILE = `./app-config-${APP_CONFIG_VALUE}.json`

const globalAppConfig = require(GLOBAL_CONFIG_FILE)

// Try env specific config
let cfg = globalAppConfig
try {
  cfg = require(ENV_CONFIG_FILE)
  console.info(`Using config from ${ENV_CONFIG_FILE}`)
} catch (err) {
  // doesn't exist - ignore and use global config
  console.info(`Using global config from ${GLOBAL_CONFIG_FILE}`)
}

module.exports = cfg
