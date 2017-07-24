
let { Router } = require('express');
let jwt = require('jsonwebtoken');
let jsonfile = require('jsonfile');
let superagent = require('superagent');
let fs = require('fs');

import * as request from 'request';
import * as util from '../../util';
import { config } from '../../config';
import {Appointment} from '../mindbody/appointment.model';
import {User} from '../user/user.model';

function checkAuth(req, res, next) {
  next();
}

export function createTypeformApi() {

  var router = Router();

  router.route('/:uid')
    .get(function(req, res) {
      request.get('https://api.typeform.com/v1/form/' + req.params.uid + '?key=' + config.typeform_config.api_key,
        function(e,b,r){
          if(e) return res.json({code: 500, data: e});
          if(r.error) return res.json({code: 500, data: r});
          res.json({code: 200, data: JSON.parse(r)});
        }
      );
    });

  router.route('/')
    .post(function(req, res) {

      var body = req.body;
      var email = '';

      for (var i = 0; i < body.form_response.definition.fields.length; i++) {
        if (body.form_response.definition.fields[i].title.indexOf('email') != -1) {

          for (var j = 0; j < body.form_response.answers.length; j++) {
            if(body.form_response.answers[j].field.id == body.form_response.definition.fields[i].id) {
              email = body.form_response.answers[j].email;
            }
          }
        }
      }

      if (email != '') {

        User.find({email: email}, function(err, users) {
          if (err) return res.json({code: 500});
          if (users.length == 0)
            res.json({code: 401});
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

              let filename = 'Pre-Test-Journal-' + body.form_response.submitted_at + '.json';
              jsonfile.writeFile("./uploads/" + filename, body.form_response, {spaces: 2}, function(err) {
              //fs.writeFile("./uploads/" + filename, JSON.stringify({'a': 'b', 'd': [{'aa': 'bb'}, {'cc': 'dd'}]}), function(err) {
                if(err) {
                  res.json({code: 500});
                } else {
                  util.get_acess_token(req, 'enterprise',config.box_config.enterprise_id, function(data) {
                    superagent
                      .post('https://upload.box.com/api/2.0/files/content')
                      .set('Authorization', 'Bearer ' + JSON.parse(b).access_token)
                      .field('attributes', JSON.stringify({
                        parent: {
                          id: users[0].journalId
                        },
                        name: filename
                      }))
                      .attach('file', './uploads/' + filename)
                      .end(function (err, data) {
                        console.log(err);
                        if (err) {
                          res.json({code: 401});
                        } else {
                          res.json({code: 200}); 
                        }
                    });

                  });
                }
              }); 
            });
          }
        });

      }
    });

  return router;
};
