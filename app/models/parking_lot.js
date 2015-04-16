var mongoose = require('mongoose');

// define the schema for our user model
var parkingLotSchema = new mongoose.Schema({
	floor_name : String,
	slot_number : String,
	is_available : Boolean
});

// methods ======================

module.exports = mongoose.model('Parking_lot', parkingLotSchema);