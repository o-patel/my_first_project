'use strict';

require('module-alias/register');
const crypto = require('crypto');
// var my_key=crypto.randomBytes(96).toString('base64')
// console.log('my_key: ', my_key);
const Glue = require('@hapi/glue');
const Glob = require('glob');
const serverConfig = require('./config/manifest');

// this is the line we mention in manifest.js
// relativeTo parameter should be defined here
const options = {
  ...serverConfig.options,
  relativeTo: __dirname,
};

// Start server
const startServer = async () => {
  try {
    const server = await Glue.compose(serverConfig.manifest, options);

    const services = Glob.sync('server/services/*.js');
    services.forEach((service) => {
      server.registerService(require(`${process.cwd()}/${service}`));
    });

    await server.start();
    console.log(`Server listening on ${server.info.uri}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();
