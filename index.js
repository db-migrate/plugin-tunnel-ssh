module.exports = {
  loadPlugin: function () {
    module.exports = Object.assign(module.exports, {
      'connection:tunnel:ssh': function (config) {
        /**
         * Always delay requires, otherwise your plugin will cause trouble
         * with db-migrates performance and generates issues to your users.
         */
        const tunnel = require('tunnel-ssh');

        if (config.privateKeyPath) {
          config.privateKey = require('fs').readFileSync(config.privateKeyPath);
        }

        return new Promise((resolve, reject) => {
          tunnel(config, err => {
            if (err) {
              return reject(err);
            }

            resolve();
          });
        });
      }
    });

    delete module.exports.loadPlugin;
  },
  name: 'tunnel-ssh',
  hooks: ['connection:tunnel:ssh']
};
