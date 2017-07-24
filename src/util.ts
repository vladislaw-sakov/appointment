
let jwt = require('jsonwebtoken');
let soap = require('soap');
import * as request from 'request';
import { config } from './config';

export function get_acess_token (req, box_sub_type, subject, callback) {
	if (req.query.token) callback({code: 200, data: {access_token: req.query.token}});
	else {
		let jti = '';
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for( var i=0; i < 20; i++ ) jti += possible.charAt(Math.floor(Math.random() * possible.length));
		request.post('https://api.box.com/oauth2/token', {
			body: 'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer' +
				'&client_id=' + config.box_config.client_id +
				'&client_secret=' + config.box_config.client_secret +
				'&assertion=' + jwt.sign({
					box_sub_type: box_sub_type,
					jti: jti
				}, config.box_config.app_auth, {
					algorithm: config.box_config.algorithm,
					issuer: config.box_config.client_id,
					audience: 'https://api.box.com/oauth2/token',
					subject: subject,
					expiresIn: 20
				})
			}, function(e, r, b){
				if(e) callback({code: 500, data: e});
				else callback({code: 200, data: JSON.parse(b)});
			}
		);
	}
	
}

export function get_soap_client (entity, callback) {

	var url = 'https://api.mindbodyonline.com/0_5/' + entity + 'Service.asmx';
	soap.createClient(url + "?wsdl", function (err, client) {
		if (err) {
		throw err;
		}

		client.setEndpoint(url);

		callback(client);
	});
}
