
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let appointmentSchema = new Schema({
	userId: {
		type: String,
		required: false,
		default: ''
	}, mindbodyId: {
		type: String,
		required: false,
		default: ''
	}, locationId: {
		type: String,
		required: false,
		default: ''
	}, sessionType: {
		type: String,
		required: false,
		default: ''
	}, staff: {
		type: String,
		required: false,
		default: ''
	}, appointmentDate: {
		type: Date,
		required: false,
		default: ''
	}
}, {collection: 'appointments'});

export let Appointment = mongoose.model('Appointments', appointmentSchema);