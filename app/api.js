var express = require('express');
var router  = express.Router();
var moment  = require('moment');
var frmt    = "YYYY-MM-DD hh:mm:ss";

//Models
var Parking_lot = require('./models/parking_lot');
var Booking     = require('./models/booking');

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('REST APIs are being used');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working
// (accessed at GET http://localhost:3000/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

/*
router.route('/parking_lots')

    // create a parking_lot (accessed at POST http://localhost:3000/api/parking_lots)
    .post(function(req, res) {
        
        // create a new instance of the parking_lot model
        var parking_lot = new Parking_lot();

        // set the parking_lots name (comes from the request)
        parking_lot.floor_name = req.body.floor_name;
        parking_lot.slot_number = req.body.slot_number;
        parking_lot.is_available = req.body.is_available;

        // save the parking_lot and check for errors
        parking_lot.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Bear created!' });
        });
        
    });

	// get all the parking_lots
	// (accessed at GET http://localhost:3000/api/parking_lots)
    .get(function(req, res, next) {
        Parking_lot.find(function(err, parking_lots) {
            if (err)
                res.send(err);

            res.json(parking_lots);
        });
    });
*/

/*router.route('/parking_lots/:lot_id')

    // get the parking_lot with specific id
    // (accessed at GET http://localhost:3000/api/parking_lots/:_id)
    .get(function(req, res, next) {
        Parking_lot.findById(req.params.lot_id, function(err, parking_lot) {
            if (err)
                res.send(err);
            res.json(parking_lot);
        });
    });*/


/*router.route('/parking_lots/:floor_name')

    // get the parking_lot with specific floor_name
    // (accessed at GET http://localhost:3000/api/parking_lots/:floor_name)
    .get(function(req, res, next) {
        Parking_lot.find(
        	{
        		floor_name : req.params.floor_name 
        	}, function(err, parking_lot) {
	            if (err)
	                res.send(err);
	            res.json(parking_lot);
        });
    });*/

//Get the avalable parking lot space searched by user
router.post('/bookings',
	function(req, res, next) {
		var body = req.body;

		console.log("floor_name : " + body.floor_name);
		console.log("checkin_time: " + body.checkin_time);
		console.log("checkout_time: " + body.checkout_time);
		
		var searchQuery = {
        	$and : [
        			{floor_name : {$ne : 'black'}},
        			{floor_name : body.floor_name}
        	]
        };

		Booking.find(searchQuery, function(err, booking) {
            if (err) {
            	console.log(err);
                res.send(err);
            }
            console.log(booking);
            res.json(booking);
        });

		/*res.json({
			floor_name : body.floor_name,
			checkin_time: body.checkin_time
			checkout_time: body.checkout_time
		});*/
	});

	/*.get(function(req, res, next) {
        Booking.find(
        {
        	$and : [
        			{floor_name : {$ne : 'black'}},
        			{floor_name : req.params.floor_name},
        			{checkin_time : req.params.booking_date + req.params.checkin_time},
        			{checkout_time : req.params.booking_date + req.params.checkout_time},
        	]
        }, function(err, parking_lot) {
            if (err)
                res.send(err);
            res.json(parking_lot);
        });
    });*/
    /*// get the parking_lot with specific floor_name
    // (accessed at GET http://localhost:3000/api/parking_lots/:_id)
    .get(function(req, res, next) {
        Parking_lot.find(
        {
        	$and : [
        			{floor_name : {$ne : 'black'}},
        			{floor_name : req.params.floor_name},
        			{is_available : true}
        	]
        }, function(err, parking_lot) {
            if (err)
                res.send(err);
            res.json(parking_lot);
        });
    });*/

module.exports = router;