/**
 * PM2 Ecosystem Configuration
 * For Artha Mitra Interdata Website Deployment
 *
 * Usage:
 *   pm2 start ecosystem.config.js
 *   pm2 save
 *   pm2 startup
 */

module.exports = {
  apps: [
    {
      // Application name
      name: 'ami-website',

      // Start command
      script: 'node',
      args: 'server.js',

      // Working directory
      cwd: '/var/www/ami',

      // Instances
      instances: 1,
      exec_mode: 'fork',

      // Environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // Logging
      log_file: '/var/log/ami/app.log',
      error_file: '/var/log/ami/error.log',
      out_file: '/var/log/ami/output.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Restart policy
      max_restarts: 10,
      restart_delay: 5000,
      autorestart: true,

      // Memory management
      max_memory_restart: '1G',

      // Watch (disabled in production)
      watch: false,

      // Kill timeout
      kill_timeout: 5000,

      // Listen timeout (time to wait for app to start)
      listen_timeout: 10000,

      // Shutdown timeout
      shutdown_with_message: false,
    },
  ],
};
