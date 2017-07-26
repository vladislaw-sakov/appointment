
let { Router } = require('express');
let jwt = require('jsonwebtoken');
let superagent = require('superagent');
let fs = require('fs');

import * as request from 'request';
import * as util from '../../util';
import { config } from '../../config';
import {Appointment} from './appointment.model';

export function createMindbodyApi() {

  var router = Router();

  router.route('/location')
    .get(function(req, res) {

      util.get_soap_client('Site', function(client) {
        var params = {
          'Request': {
            'SourceCredentials': {
              'SourceName': config.mindbody_config.sourcename,
              'Password': config.mindbody_config.key,
              'SiteIDs': {
                'int': [config.mindbody_config.site_id]
              }
            }
          }
        };

        client.Site_x0020_Service.Site_x0020_ServiceSoap.GetLocations (params, function (errs, result) {
          if (errs) {
            res.json({code: 500, data: errs});
          } else {
            res.json({code: 200, data: result.GetLocationsResult.Locations.Location});
          }
        });
      });
    });

  router.route('/staff')
    .get(function(req, res) {

      util.get_soap_client('Staff', function(client) {
        var params = {
          'Request': {
            'SourceCredentials': {
              'SourceName': config.mindbody_config.sourcename,
              'Password': config.mindbody_config.key,
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

        client.Staff_x0020_Service.Staff_x0020_ServiceSoap.GetStaff (params, function (errs, result) {
          if (errs) {
            res.json({code: 500, data: errs});
          } else {
            res.json({code: 200, data: result.GetStaffResult.StaffMembers.Staff});
          }
        });
      });
    });

  router.route('/sessiontype')
    .get(function(req, res) {

      util.get_soap_client('Site', function(client) {
        var params = {
          'Request': {
            'SourceCredentials': {
              'SourceName': config.mindbody_config.sourcename,
              'Password': config.mindbody_config.key,
              'SiteIDs': {
                'int': [config.mindbody_config.site_id]
              }
            }
          }
        };

        client.Site_x0020_Service.Site_x0020_ServiceSoap.GetSessionTypes (params, function (errs, result) {
          if (errs) {
            res.json({code: 500, data: errs});
          } else {
            res.json({code: 200, data: result.GetSessionTypesResult.SessionTypes.SessionType});
          }
        });
      });
    })

  router.route('/appointments')
    .get(function(req, res) {

      /*Appointment.find({}, function(err, appointments) {
        res.json({code: 200, data: appointments});
      });*/
      
      util.get_soap_client('Staff', function(client) {
        var params = {
          'Request': {
            'SourceCredentials': {
              'SourceName': config.mindbody_config.sourcename,
              'Password': config.mindbody_config.key,
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

        client.Staff_x0020_Service.Staff_x0020_ServiceSoap.GetStaff (params, function (errs, result) {
          if (errs) {
            res.json({code: 500, data: errs});
          } else {
            var staffIDs = [];
            for( var i = 0; i < result.GetStaffResult.StaffMembers.Staff.length; i++) {
              staffIDs.push(result.GetStaffResult.StaffMembers.Staff[i].ID);
            }

            util.get_soap_client('Appointment', function(client) {
              var params = {
                'Request': {
                  'SourceCredentials': {
                    'SourceName': config.mindbody_config.sourcename,
                    'Password': config.mindbody_config.key,
                    'SiteIDs': {
                      'int': [config.mindbody_config.site_id]
                    }
                  },
                  'StaffCredentials': {
                    'Username': config.mindbody_config.username,
                    'Password': config.mindbody_config.password,
                    'SiteIDs': {
                      'int': [config.mindbody_config.site_id]
                    }
                  },
                  'StaffIDs': {
                    'long': staffIDs
                  },
                  'StartDate': req.query.startDate,
                  'EndDate': req.query.endDate
                }
              };

              client.Appointment_x0020_Service.Appointment_x0020_ServiceSoap.GetStaffAppointments (params, function (errs, result) {
                if (errs) {
                  res.json({code: 500, data: errs});
                } else {
                  res.json({code: 200, data: result.GetStaffAppointmentsResult.Appointments});
                }
              });
            });

          }
        });
      });


    })
    .post(function(req, res) {

      var newAppointment = new Appointment({
        userId: req.body.userId,
        mindbodyId: req.body.mindbodyId,
        locationId: req.body.locationId,
        sessionType: req.body.sessionType,
        staff: req.body.staff,
        appointmentDate: req.body.appointmentDate
      });

      newAppointment.save(function(err, user) {
        res.json(user);
        util.get_soap_client('Appointment', function(client) {
          var params = {
            'Request': {
              'SourceCredentials': {
                'SourceName': config.mindbody_config.sourcename,
                'Password': config.mindbody_config.key,
                'SiteIDs': {
                  'int': [config.mindbody_config.site_id]
                }
              },
              'StaffCredentials': {
                'Username': config.mindbody_config.username,
                'Password': config.mindbody_config.password,
                'SiteIDs': {
                  'int': [config.mindbody_config.site_id]
                }
              },
              'Test': false,

              'Appointments': {
                'Appointment': {
                  'StartDateTime': req.body.appointmentDate,
                  'Location': {
                      'ID': req.body.locationId,
                  },
                  'Staff': {
                      'ID': req.body.staff
                  },
                  'Client': {
                      'ID': req.body.userId
                  },
                  'SessionType': {
                      'ID': req.body.sessionType
                  }
                }
              }
            }
          };

          /*client.Appointment_x0020_Service.Appointment_x0020_ServiceSoap.AddOrUpdateAppointments (params, function (errs, result) {
            if (errs) {
              res.json({code: 500, data: errs});
            } else {
              res.json({code: 200, data: result});
            }
          });*/
        });
      });

    });

  return router;
};
