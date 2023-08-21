'use strict';

const mongoose = require('mongoose');

const Joi = require('@hapi/joi');

const Bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const Uuidv4 = require('uuid/v4');

const Types = Schema.Types;

const modelName = 'user123';

const errorHelper = require('utilities/error-helper');

const dbConn = require('plugins/mongoose.plugin').plugin.dbConn();

const User123Schema = new Schema(
  {
    firstName: {
      type: Types.String,
      default: null,
      canSearch: true,
    },
    lastName: {
      type: Types.String,
      default: null,
      canSearch: true,
    },
    email: {
      type: Types.String,
      required: true,
      unique: true,
      index: true,
      stringType: 'email',
      canSearch: true,
    }
  },
  {
    collection: modelName,
    timestamps: true,
    versionKey: false,
  },
);




module.exports.schema = dbConn.model(modelName, User123Schema);
