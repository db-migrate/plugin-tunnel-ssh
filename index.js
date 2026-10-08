module.exports = {
  loadPlugin: function () {
    module.exports = Object.assign(module.exports, {
      'connection:tunnel:ssh': function (config) {
        /**
         * Always delay requires, otherwise your plugin will cause trouble
         * with db-migrates performance and generates issues to your users.
         */
        const { createTunnel } = require('tunnel-ssh');
        const {
          localHost = '127.0.0.1',
          localPort,
          dstHost,
          dstPort,
          keepAlive,
          privateKeyPath,
          tunnelType,
          ...ssh
        } = config;

        if (privateKeyPath) {
          ssh.privateKey = require('fs').readFileSync(privateKeyPath);
        }

        // the flat config of tunnel-ssh 4 kept working, it is split up for
        // tunnel-ssh 5: the local server, the ssh connection and the target
        return createTunnel(
          { autoClose: !keepAlive },
          { host: localHost, port: localPort },
          ssh,
          { srcAddr: localHost, srcPort: localPort, dstAddr: dstHost, dstPort }
        );
      }
    });

    delete module.exports.loadPlugin;
  },
  name: 'tunnel-ssh',
  hooks: ['connection:tunnel:ssh']
};
