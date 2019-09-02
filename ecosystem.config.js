module.exports = {
  apps: [{
    name: 'pi-weather-collector',
    script: 'index.js',

    instances: 1,
    exp_backoff_restart_delay: 100,

    log_file: 'pw_col.log',
    merge_logs: true,
    time: true,

    watch: true,
    ignore_watch: ['node_modules', 'pw_col.log', '.git'],
    watch_options: {
      followSymlinks: false
    },

    env: {
      APP_CONFIG: ''
    },
    env_mock: {
      APP_CONFIG: 'mock'
    }
  }]
}
