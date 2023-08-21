'use strict';

const db = require('mongoose');
const Glob = require('glob');
const BSON = require('bson');
db.Promise = require('bluebird');
const ClientEncryption = require('mongodb-client-encryption').ClientEncryption
const Mongo = require('mongodb').MongoClient

let dbConn = null;
let _client = null
let _db = null
module.exports.plugin = {
  async register(server, options) {
    try {
      dbConn = await db.createConnection(options.connections.db,{ useUnifiedTopology: true,
        useNewUrlParser: true 
      } );

      _client = await Mongo.connect(options.connections.db, {
        useUnifiedTopology: true
     })

     _db = _client.db('hapi18')

      // When the connection is connected
      dbConn.on('connected', () => {
        server.log(['mongoose', 'info'], 'dbConn Mongo Database connected');
      });

      // When the connection is disconnected
      dbConn.on('disconnected', () => {
        server.log(['mongoose', 'info'], 'dbConn Mongo Database disconnected');
      });

      server.decorate('server', 'db', dbConn);

      // If the node process ends, close the mongoose connection
      process.on('SIGINT', async () => {
        await dbConn.close();
        server.log(
          ['mongoose', 'info'],
          'Mongo Database disconnected through app termination',
        );
        process.exit(0);
      });

      // Load models
      const models = Glob.sync('server/models/*.js');
      models.forEach((model) => {
        require(`${process.cwd()}/${model}`);
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  dbConn() {
    return dbConn;
  },
  encryptTest(){
   return new ClientEncryption(_client, {
      keyVaultNamespace: 'encryption.__dataKeys',
      kmsProviders: {
          local: {
              key: Buffer.from("OT8XwAVGZvPLsmEKrmddkznOM/Go+JnQ/soytxX7kCNQCI95ulQIMUTP0cYEjjZnHmnyNBQkvlOd+hSxyNySwBvnU2q90sRg9i7ORQ4Z70hQlNLPZMZPRzPVBD5IzZoZ", 'base64')
          }
      },
      bson: BSON
  })
  },
  db(){
    return _db
  },
  name: 'mongoose_connector',
  version: require('../../package.json').version,
};
