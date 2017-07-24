
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let userSchema = new Schema({
	firstName: {
		type: String,
		required: false,
		default: ''
	},
	lastName: {
		type: String,
		required: false,
		default: ''
	},
	email: {
		type: String,
		required: false,
		default: ''
	},
	password: {
		type: String,
		required: false,
		default: ''
	},
	city: {
		type: String,
		required: false,
		default: ''
	},
	state: {
		type: String,
		required: false,
		default: ''
	},
	country: {
		type: String,
		required: false,
		default: ''
	},
	folderId: {
		type: String,
		required: false,
		default: ''
	},
	mindbodyId: {
		type: String,
		required: false,
		default: ''
	},
	journalId: {
		type: String,
		required: false,
		default: ''
	} 
}, {collection: 'users'});

export let User = mongoose.model('Users', userSchema);