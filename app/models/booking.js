var mongoose = require('mongoose');

// define the schema for our user model
var bookingSchema = new mongoose.Schema({
	email : String,
	floor_name : String,
	slot_number : String,
	checkin_time : Date,
	checkout_time : Date
});

// methods ======================

module.exports = mongoose.model('Booking', bookingSchema);