
let { Router } = require('express');
let jwt = require('jsonwebtoken');
let async = require('async');

import {User} from './user.model';
import * as bcrypt from 'bcrypt';
import * as request from 'request';
import * as util from '../../util';
import { config } from '../../config';

export function createUserApi() {

  var router = Router()

  router.route('/')
    .get(function(req, res) {
      User.find({}, function(err, users) {
        if (err) {
          res.json({code: 402, data: err});
        } else
          res.json({code: 200, data: users});
      });
    })

    .post(function(req, res) {

      User.findOne({email: req.body.email}, function(err, user) {
        if (user) {
          res.json({code: 403, data: 'User already exist.'});
        } else {
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(req.body.password, salt, function(err, hash) {

              var box_access_token = '';
              var folderId = '';
              var journalsId = '';

              async.series([

                function getBoxToken(step) {
                  let jti = '';
                  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

                  for( var i=0; i < 20; i++ ) jti += possible.charAt(Math.floor(Math.random() * possible.length));
                  request.post('https://api.box.com/oauth2/token', {
                    body: 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer' +
                    '&client_id=' + config.box_config.client_id +
                    '&client_secret=' + config.box_config.client_secret +
                    '&assertion=' + jwt.sign({
                      box_sub_type: 'enterprise',
                      jti: jti
                    }, config.box_config.app_auth, {
                      algorithm: config.box_config.algorithm,
                      issuer: config.box_config.client_id,
                      audience: 'https://api.box.com/oauth2/token',
                      subject: config.box_config.enterprise_id,
                      expiresIn: 20
                    })
                  }, function(e, r, b){
                    box_access_token = JSON.parse(b).access_token;
                    step();
                  });
                },
                function createUserFolder(step) {
                  request({
                    headers: {
                      Authorization: 'Bearer ' + box_access_token
                    },
                    body: JSON.stringify({name: req.body.email, parent: {id: 0}}),
                    uri: 'https://api.box.com/2.0/folders',
                    method: 'POST'
                  }, function (err, r, body) {
                    folderId = JSON.parse(body).id;
                    step();
                  });
                },

                function createMindbodyClient(step) {
                  /*util.get_soap_client('Client', function(client) {
                    var params = {
                      'Request': {
                        'SourceCredentials': {
                          'SourceName': config.mindbody_config.sourcename,
                          'Password': config.mindbody_config.key,
                          'SiteIDs': {
                            'int': [config.mindbody_config.site_id]
                          }
                        },
                        'UserCredentials': {
                          'Username': config.mindbody_config.username,
                          'Password': config.mindbody_config.password,
                          'SiteIDs': {
                            'int': [config.mindbody_config.site_id]
                          }
                        },
                        'Clients': {
                          'Client': {
                            'FirstName': req.body.firstName,
                            'LastName': req.body.lastName,
                            'BirthDate': '1992-01-01'
                          }
                        }
                      }
                    };

                    client.Client_x0020_Service.Client_x0020_ServiceSoap.AddOrUpdateClients (params, function (errs, result) {
                      if (errs) {
                        res.json({code: 500, data: errs});
                      } else {
                        step();
                      }
                    });
                  */
                  step();
                },

                function createJournalsFolder(step) {
                  request({
                    headers: {
                      Authorization: 'Bearer ' + box_access_token
                    },
                    body: JSON.stringify({name: 'Journals', parent: {id: folderId}}),
                    uri: 'https://api.box.com/2.0/folders',
                    method: 'POST'
                  }, function (err, r, body) {
                    journalsId = JSON.parse(body).id;
                    step();
                  });
                },

                function createBodyCompositionFolder(step) {
                  request({
                    headers: {
                      Authorization: 'Bearer ' + box_access_token
                    },
                    body: JSON.stringify({name: 'Body Composition', parent: {id: folderId}}),
                    uri: 'https://api.box.com/2.0/folders',
                    method: 'POST'
                  }, function (err, r, body) {
                    step();
                  });
                },

                function createFitnessFolder(step) {
                  request({
                    headers: {
                      Authorization: 'Bearer ' + box_access_token
                    },
                    body: JSON.stringify({name: 'Fitness', parent: {id: folderId}}),
                    uri: 'https://api.box.com/2.0/folders',
                    method: 'POST'
                  }, function (err, r, body) {
                    step();
                  });
                },

                function createMetabolismFolder(step) {
                  request({
                    headers: {
                      Authorization: 'Bearer ' + box_access_token
                    },
                    body: JSON.stringify({name: 'Metabolism', parent: {id: folderId}}),
                    uri: 'https://api.box.com/2.0/folders',
                    method: 'POST'
                  }, function (err, r, body) {
                    step();
                  });
                },

                function createUser(step) {
                  var newUser = new User({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    password: hash,
                    city: req.body.city,
                    country: req.body.country,
                    state: req.body.state,
                    email: req.body.email,
                    folderId: folderId,
                    journalId: journalsId,
                    mindbodyId: '' //result.AddOrUpdateClientsResult.Clients.Client[0].ID
                  });

                  newUser.save(function(err, user) {
                    res.json({code: 200, data: user, token: box_access_token});
                  });
                }

              ]);

            });
          })
        }
      });
    });

  router.route('/login')
    .post(function(req, res) {
      
      User.find({email: req.body.email}, function(err, users) {
        if (users.length == 0) {
          res.json({code: 401, data: 'Invalid Credentials.'})
        } else {
          bcrypt.compare(req.body.password, users[0].password, function (err, isMatch) {
            if (isMatch == false)
              res.json({code: 401, data: 'Invalid Credentials.'})
            else {

              let jti = '';
              var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

              for( var i=0; i < 20; i++ ) jti += possible.charAt(Math.floor(Math.random() * possible.length));
              request.post('https://api.box.com/oauth2/token', {
                body: 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer' +
                '&client_id=' + config.box_config.client_id +
                '&client_secret=' + config.box_config.client_secret +
                '&assertion=' + jwt.sign({
                  box_sub_type: 'enterprise',
                  jti: jti
                }, config.box_config.app_auth, {
                  algorithm: config.box_config.algorithm,
                  issuer: config.box_config.client_id,
                  audience: 'https://api.box.com/oauth2/token',
                  subject: config.box_config.enterprise_id,
                  expiresIn: 20
                })
              }, function(e, r, b){
                res.json({code: 200, data: users[0], token: JSON.parse(b).access_token});
              });
            }
          })
        }
      });
    })

  return router;
};
