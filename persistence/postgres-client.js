const { Pool } = require('pg')
const appConfig = require('../config/app-config.json')

const CREATE_TABLE = `create table if not exists ${appConfig.postgres.table_name} (id serial primary key, alias text, type text, timestamp text, temperature numeric, humidity numeric, pressure numeric);`
const INSERT_ROW = `INSERT INTO ${appConfig.postgres.table_name}(alias, type, timestamp, temperature, humidity, pressure) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`

let pool

module.exports.init = function () {
  pool = new Pool({
    user: appConfig.postgres.user,
    host: appConfig.postgres.host,
    database: appConfig.postgres.database,
    password: appConfig.postgres.password,
    port: appConfig.postgres.port
  })
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client: ' + err, err)
  })
  return pool.query(CREATE_TABLE)
}

module.exports.write = function (data) {
  const values = [data.alias, data.type, data.timestamp, data.temperature, data.humidity, data.pressure]
  return pool.query(INSERT_ROW, values)
}