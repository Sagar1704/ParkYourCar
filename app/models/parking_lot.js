var mongoose = require('mongoose');

// define the schema for our user model
var parkingLotSchema = mongoose.Schema({
	floor_name : String,
	slot_number : Number,
	is_available : Boolean
});

// methods ======================
