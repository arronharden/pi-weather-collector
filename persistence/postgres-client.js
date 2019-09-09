const { Pool } = require('pg')
const appConfig = require('../config')

let pool

module.exports.init = function () {
  if (!appConfig.postgres) {
    return Promise.reject(new Error('No postgres config defined'))
  }
  const reqAttrs = ['user', 'password', 'host', 'tableName', 'database']
  reqAttrs.forEach((attr) => {
    if (!appConfig.postgres[attr]) {
      return Promise.reject(new Error(`Missing required attribute ${attr} in postgres config`))
    }
  })
  const config = {
    user: appConfig.postgres.user,
    host: appConfig.postgres.host,
    database: appConfig.postgres.database,
    password: appConfig.postgres.password,
    port: appConfig.postgres.port
  }
  pool = new Pool(config)
  pool.on('error', (err, client) => {
    console.error(`Postgres error: ${err}`, err)
  })
  const CREATE_TABLE = `create table if not exists ${appConfig.postgres.tableName} (id serial primary key, alias text, type text, timestamp text, temperature numeric, humidity numeric, pressure numeric);`
  return pool.query(CREATE_TABLE)
    .then(() => {
      const info = Object.assign({}, config, { password: '********', tableName: appConfig.postgres.tableName })
      console.log(`Initialised postgres ${JSON.stringify(info)}.`)
    })
}

module.exports.write = function (data) {
  const values = [data.alias, data.type, data.timestamp, data.temperature, data.humidity, data.pressure]
  const INSERT_ROW = `INSERT INTO ${appConfig.postgres.tableName}(alias, type, timestamp, temperature, humidity, pressure) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`
  return pool.query(INSERT_ROW, values)
}
