## Introduction
The `pi-weather-collection` is a simple node.js application that will collect external sensor data (e.g. temperature, pressure, humidity) using a Raspberry Pi and push it into a PostgreSQL database. Supports BME280, DHT11, DHT22, and DS18B20 sensors. The data can be viewed and/or tweeted using the [pi-weather-app](https://github.com/arronharden/pi-weather-app) project.

The PostgreSQL table will be created if it does not already exist, but the database specified in the configuration file must already exist and be ready to use.

## Configuration
Create a copy of the template configuration file in `config/app-config-template.json` and save it as `config/app-config.json`. Enter the relevant details for the PostgreSQL database to use and the sensor information connected to the Raspberry Pi.

## Development mode
Development mode will start an instance of node.js which will periodically read the data from the sensor and write it to the PostgreSQL table.

To start in development mode using the default `app_config.json` configuration, run the command:

```
npm run start:dev
```

To start in development mode using the `app_config-mock.json` configuration, run the command:

```
npm run start:dev -- --app_config=mock
```

## Production mode
Production mode uses [PM2](http://pm2.keymetrics.io/) to control the instance of node.js.

To start in production mode, use:

```
npm start
```

To stop the instance, use:

```
npm stop
```

Other PM2 commands and be used to manage the running instance. For example, to view the logs use:

Windows:

```
node .\node_modules\pm2\bin\pm2 logs pi-weather-collector
```

MacOS/Linux

```
./node_modules/pm2/bin/pm2 logs pi-weather-collector
```
