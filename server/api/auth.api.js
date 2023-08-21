'use strict';

const Joi = require('@hapi/joi');
const config = require('config');
const Boom = require('@hapi/boom');

const errorHelper = require('utilities/error-helper');
const Token = require('utilities/create-token');
const encryptTest = require('plugins/mongoose.plugin').plugin.encryptTest();
const db = require('plugins/mongoose.plugin').plugin.db();
const User = require('models/user.model').schema;
const User123 = require('models/user123.model').schema;
module.exports = {
  login: {
    validate: {
      payload: Joi.object().keys({
        username: Joi.string().required().trim().label('Username'),
        password: Joi.string().required().trim().label('Password'),
      }),
    },
    pre: [
      {
        assign: 'user',
        method: async (request, h) => {
          try {
            const username = request.payload.username;
            const password = request.payload.password;

            let user = await User.findByCredentials(username, password);
            if (user) {
              return user;
            } else {
              errorHelper.handleError(
                Boom.badRequest('Wrong username or password'),
              );
            }
          } catch (err) {
            errorHelper.handleError(err);
          }
          return h.continue;
        },
      },
      {
        assign: 'accessToken',
        method: (request, h) => {
          return Token(request.pre.user, config.constants.EXPIRATION_PERIOD);
        },
      },
      {
        assign: 'emailVerified',
        method: (request, h) => {
          // TODO: Create Email service to send emails
          return h.continue;
        },
      },
      {
        assign: 'lastLogin',
        method: async (request, h) => {
          try {
            const lastLogin = Date.now();
            await User.findByIdAndUpdate(request.pre.user._id, {
              lastLogin: lastLogin,
            });
            return lastLogin;
          } catch (err) {
            errorHelper.handleError(err);
          }

          return h.continue;
        },
      },
    ],
    handler: async (request, h) => {
      let accessToken = request.pre.accessToken;
      let response = {};

      delete request.pre.user.password;

      response = {
        user: request.pre.user,
        accessToken,
      };
      return h.response(response).code(200);
    },
  },
  signup: {
    validate: {
      payload: Joi.object().keys({
        firstName: Joi.string().required().trim().label('First Name'),
        lastName: Joi.string().required().trim().label('Last Name'),
        email: Joi.string().email().required().trim().label('Email')
      }),
    },
    pre: [
      {
        assign: 'signup',
        method: async (request, h) => {
          let userPayload = request.payload;
          try {
            userPayload.mongodbEmployeeId = '63f6fd35c4bfbca9d2d3c0c1'
            let createdUser = await User.create(userPayload);
            // const filter = { _id: "63f49b861b03ec1d9481f48d" };
            // const update = { lastName: "test1" };
            // let doc = await User.findOneAndUpdate(filter, update);
            // console.log('doc: ', doc);
            // console.log(await User.findOne({"firstName" : "sadasdsa123"}))

            let allmongooseuser = await User.aggregate([
             
             
             {
              $lookup: {
                from: "user123",
                let: { model_id: "$_id" },
                pipeline: [
                  { "$addFields": { "mongooseUserId": { "$toObjectId": "$mongooseUserId" }}},
                  {
                    $match: {
                      $expr: { $eq: ["$mongooseUserId", "$$model_id"] },
                      // mongooseUserId: objectId("$model_id")
                    }
                  }
                ],
                as: "mongooseUsers"
              }
            }
            ])
    

            return allmongooseuser;
          } catch (err) {
            errorHelper.handleError(err);
          }
        },
      },
    ],
    handler: async (request, h) => {
      return h.response(request.pre.signup).code(201);
    },
  },
  me: {
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).options({
        allowUnknown: true,
      }),
    },
    pre: [],
    handler: async (request, h) => {
      const { userService } = request.server.services();

      const user = await userService.getUserById(
        request.auth.credentials.user._id,
      );

      return h.response(user);
    },
  },
  signup123: {
    validate: {
      payload: Joi.object().keys({
        firstName: Joi.string().required().trim().label('First Name'),
        lastName: Joi.string().required().trim().label('Last Name'),
        email: Joi.string().email().required().trim().label('Email')
      }),
    },
    pre: [
      {
        assign: 'signup',
        method: async (request, h) => {
          try {
         
          const encrypt  = (object, random) =>{
            return _transformObject(object, (value) => {
                return encryptTest.encrypt(value, {
                    keyAltName: 'www',
                    algorithm: random ? 'AEAD_AES_256_CBC_HMAC_SHA_512-Random' : 'AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic'
                })
            })
          }
      
        const decrypt= (object) =>{
            return _transformObject(object, (value) => {
                return encryptTest.decrypt(value)
            })
        }

        const _transformObject = (object, callback)=> {
          if (!object) {
              return
          }
          if (typeof object === 'string') { // string ENcryption
              return callback(object)
          }
  
          if (object._bsontype === 'Binary') { // string DEcryption
              return callback(object)
          }
  
          const transformedObject = {}
          return Promise.all(Object.keys(object).map((key) => {
              return callback(object[key]).then((value) => {
                  transformedObject[key] = value
              })
          })).then(() => {
              return transformedObject
          })
       }
      
        const encryptedModel = await encrypt({
          firstName:"test7778899", lastName:"test888999", email:"test888@gmail.com"
        })
        console.log('encryptasdTasdest: ');
        console.log(encryptedModel.firstName)
        let payload = {
          mongooseUserId:"63f6f919b5aef3539cf3990b",
          firstName:encryptedModel.firstName,
          lastName:encryptedModel.lastName,
          email:encryptedModel.email,
          ssn:"asdsadasdasd"
        }

        let usercreated = await db.collection('user123').insertOne(payload);
        // console.log('usercreated: ', usercreated);

      

        const encryptedModel1 = await encrypt({
          firstName:"test7778899", lastName:"test888999", email:"test888@gmail.com"
        })

        let payload123 = {
          userId:usercreated.insertedId,
          firstName:encryptedModel1.firstName,
          lastName:encryptedModel1.lastName,
          email:encryptedModel1.email,
          ssn:"asdsadasdasd"
        }

        await db.collection('employee').insertOne(payload123);

        let allemployee = await db.collection('employee').aggregate([
          {
            $lookup: {
              from: "user",
              let: { model_id: "$_id" },
              pipeline: [
                { "$addFields": { "mongodbEmployeeId": { "$toObjectId": "$mongodbEmployeeId" }}},
                {
                  $match: {
                    $expr: { $eq: ["$mongodbEmployeeId", "$$model_id"] },
                    // mongooseUserId: objectId("$model_id")
                  }
                }
              ],
              as: "mongodbEmployee"
            }
          }
        ]).toArray();
        console.log('allemployee: ', allemployee);


        let alluser = await db.collection('user123').aggregate([
          {
            $lookup:
               {
                  from: "employee",
                  localField: "_id",
                  foreignField: "userId",
                  as: "enrollee_info"
              }
         }
        ]).toArray();


             const search = await encrypt({
               firstName:"test7778899"
              })
              // console.log('search: ', search);

              // const search = await encrypt(
              //   {'firstName': /test/}
              //  )
              //  console.log('search: ', search);

        //    const user1233 = await db.collection('user123').findOne(search)
        //    console.log('user1233: ', user1233);

        //    const lastName = await encrypt({
        //     lastName:"ABC123444"
        //    })
        //    console.log('lastName: ', lastName);
        //    let user555 = db.collection('user123')
        //    user555.updateOne(
        //     { _id: user1233._id },
        //     {
        //       $set: lastName
        //     }
        //  )
        //  const user = await db.collection('user123').findOne(search)
          //  const decrypted = await decrypt({ firstName: user.firstName, email: user.email ,lastName: user.lastName })
        return allemployee
          } catch (err) {
            errorHelper.handleError(err);
          }
        },
      },
    ],
    handler: async (request, h) => {
      return h.response(request.pre.signup).code(201);
    },
  },
};
