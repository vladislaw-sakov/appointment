
let { Router } = require('express');
let jwt = require('jsonwebtoken');
let superagent = require('superagent');
let fs = require('fs');

import * as request from 'request';
import * as util from '../../util';
import { config } from '../../config';
import * as multer from 'multer';

let uploader = multer({
  storage: multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  })
});


function checkAuth(req, res, next) {
  console.log('---- Authenticating ----');
  next();
}

export function createBoxApi() {

  var router = Router();

  router.route('/')
    .get(function(req, res) {
      
    })
    .post(function(req, res) {
    });

  router.route('/:folder')
    .get(checkAuth, function(req, res) {

      util.get_acess_token(req, 'enterprise',config.box_config.enterprise_id, function(data) {
        request({
          headers: {
            Authorization: 'Bearer ' + data.data.access_token
          },
          uri: 'https://api.box.com/2.0/folders/' + req.params.folder + '/items?fields=modified_at,description,name,path_collection',
          method: 'GET'
        }, function (err, r, body) {
          if (body == '')
            res.json({code: 401});
          else {
            try {
              res.json({code: 200, data: JSON.parse(body)});
            } catch(e) {
              res.json({code: 500});
            }
          }
        });
      });
    })
    .post(checkAuth, function(req, res) {
      util.get_acess_token(req, 'enterprise',config.box_config.enterprise_id, function(data) {
        request({
          headers: {
            Authorization: 'Bearer ' + data.data.access_token
          },
          uri: 'https://api.box.com/2.0/folders?fields=description,modified_at,name,description',
          method: 'POST',
          body: JSON.stringify({name: req.body.name, parent: {id: req.params.folder}})
        }, function (err, r, body) {
          if (body == '')
            res.json({code: 401});
          else {
            request({
              headers: {
                Authorization: 'Bearer ' + data.data.access_token
              },
              uri: 'https://api.box.com/2.0/folders/' + JSON.parse(body).id + '?fields=description,modified_at,name,description',
              method: 'PUT',
              body: JSON.stringify({description: req.body.description})
            }, function (err, r, body) {
              if (body == '')
                res.json({code: 401});
              else
                res.json({code: 200, data: JSON.parse(body)});
            });
          }
        });
      });
    })
    .delete(checkAuth, function(req, res) {

      let uri = '';
      if (req.query.type == 'folder') uri = 'https://api.box.com/2.0/folders/' + req.params.folder + '?recursive=true';
      else uri = 'https://api.box.com/2.0/files/' + req.params.folder;

      util.get_acess_token(req, 'enterprise',config.box_config.enterprise_id, function(data) {
        request({
          headers: {
            Authorization: 'Bearer ' + data.data.access_token
          },
          uri: uri,
          method: 'DELETE'
        }, function (err, r, body) {
          console.log(err);
          res.json({code: 200});
        });
      });
    });

  router.route('/:folder/info')
    .get(checkAuth, function(req, res) {

      util.get_acess_token(req, 'enterprise',config.box_config.enterprise_id, function(data) {
        request({
          headers: {
            Authorization: 'Bearer ' + data.data.access_token
          },
          uri: 'https://api.box.com/2.0/folders/' + req.params.folder,
          method: 'GET'
        }, function (err, r, body) {
          if (body == '')
            res.json({code: 401});
          else {
            try {
              res.json({code: 200, data: JSON.parse(body)});
            } catch(e) {
              res.json({code: 500});
            }
          }
        });
      });
    });

  router.route('/:folder/upload')
    .post(checkAuth, uploader.any(), function(req, res) {

      util.get_acess_token(req, 'enterprise',config.box_config.enterprise_id, function(data) {

        superagent
          .post('https://upload.box.com/api/2.0/files/content')
          .set('Authorization', 'Bearer ' + data.data.access_token)
          .field('attributes', JSON.stringify({
                  parent: {
                    id: req.params.folder
                  },
                  name: req.files[0].originalname
            }))
          .attach('file', './uploads/' + req.files[0].originalname)
          .end(function (err, data) {
            console.log(err);
            if (err) {
              res.json({code: 401});
            } else {
              res.json({code: 200, data: data.body.entries[0]}); 
            }
        });

      });

    });

  router.route('/:folder/download')
    .get(checkAuth, function(req, res) {
      util.get_acess_token(req, 'enterprise',config.box_config.enterprise_id, function(data) {
        superagent
          .get('https://api.box.com/2.0/files/' + req.params.folder + '/content')
          .set('Authorization', 'Bearer ' + data.data.access_token)
          .redirects(0)
          .end(function (err, data) {
            console.log(err);
            res.json({code: 200, data: data.headers.location});
        });
      });
    });

  router.route('/:folder/note')
    .post(checkAuth, function(req, res) {
      let filename = req.body.name + '.note';
      fs.writeFile("./uploads/" + filename, req.body.content, function(err) {
        if(err) {
          res.json({code: 500});
        } else {
          util.get_acess_token(req, 'enterprise',config.box_config.enterprise_id, function(data) {
            superagent
              .post('https://upload.box.com/api/2.0/files/content')
              .set('Authorization', 'Bearer ' + data.data.access_token)
              .field('attributes', JSON.stringify({
                parent: {
                  id: req.params.folder
                },
                name: filename
              }))
              .attach('file', './uploads/' + filename)
              .end(function (err, data) {
                console.log(err);
                if (err) {
                  res.json({code: 401});
                } else {
                  res.json({code: 200, data: data.body.entries[0]}); 
                }
            });

          });
        }
      }); 
    });

  return router;
};
