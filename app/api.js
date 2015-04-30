var express = require('express');
var router  = express.Router();
var moment  = require('moment');
var frmt    = "YYYY-MM-DDThh:mm:ss.mmZ";

//Models
var User        = require('./models/user');
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
	console.log('All routes API call');
    res.json({ message: 'hooray! welcome to our api!' });
});

//Get the available slots based on the user search
router.post('/search', isTokenValid,
       function(req, res) {
		var body = req.body;
        
        // console.log("token : " + body.token.trim());
		// console.log("floor_name : " + body.floor_name);
		// console.log("checkin_time: " + body.checkin_time);
		// console.log("checkout_time: " + body.checkout_time);
		
		//Query to search in the booking table
		var searchQuery = {
			$and: [
				{floor_name : {$ne : 'black'}},
				{floor_name : body.floor_name},
				{$or : [ 
					{$and : [
						{checkin_time : {$lt : body.checkout_time}},
						{checkout_time : {$gt : body.checkin_time}}
					]},
					{$and : [
						{checkin_time : {$lt : body.checkin_time}},
						{checkout_time : {$gt : body.checkout_time}}
					]}
				]
				}
	        ]
        };

        //Get the bookings
		Booking.find(searchQuery, {_id : 0, slot_number : 1}, function(err, booking) {
            if (err) {
            	console.log(err);
                res.send(err);
            }
            console.log(booking);

            //Get the array of slot_numbers which are already booked in the searched slot
            var bookedSlots = new Array();
            console.log('booking length:: ' + booking.length);
        	for (var i = 0; i < booking.length; i++) {
        		bookedSlots.push(booking[i].slot_number);
     		}

     		//console.log(bookedSlots);

     		//Search the available slots
            searchQuery = {
            	$and : [
    				{floor_name : {$ne : 'black'}},
    				{floor_name : body.floor_name}
        		],
        		slot_number : {$nin : bookedSlots},
        		is_available : true
            };

            Parking_lot.find(searchQuery, {_id : 0 }, function(err, parking_lot) {
            	if (err) {
            		console.log(err);
                	res.send(err);
            	}
	            console.log(parking_lot);
	            res.json(
	            	{
	            		status: 200,
	            		title : "Search Results",
	            		parking_lots : parking_lot
	            	});
	        });
        });
	}
);

//Book the available slot
router.post('/book', isTokenValid,
	function(req, res) {
		var body = req.body;
		console.log("email : " + body.email.trim());
		// console.log("floor_name : " + body.floor_name);
		// console.log("slot_number : " + body.slot_number);
		// console.log("checkin_time: " + body.checkin_time);
		// console.log("checkout_time: " + body.checkout_time);

		var insertQuery = {
			email : body.email.trim(),
			floor_name : body.floor_name,
			slot_number : body.slot_number,
			checkin_time : body.checkin_time,
			checkout_time : body.checkout_time
		};

		Booking.create(insertQuery, function(err, booking) {
			if(err) {
        		console.log(err);
            	res.send(err);
            }

			res.json(
        	{
        		status: 200
        	});
		});
	}
);

//View booked slots
router.post('/view', isTokenValid,
    function(req, res) {
        var body = req.body;

        console.log("email : " + body.email.trim());
        
        //Query to search in the booking table
        var searchQuery = {
            email : body.email.trim()
        };

        var columns = {
            _id : 0,
            floor_name : 1,
            slot_number : 1,
            checkin_time : 1,
            checkout_time :1
        };

        //Get the bookings
        Booking.find(searchQuery, columns, function(err, booking) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            console.log(booking);

            res.json(
            {
                status: 200,
                bookings : booking
            });
        });
    }
);

//Cancel booking
router.delete('/cancel', isTokenValid,
    function(req, res) {
        var body = req.body;

        console.log("email : " + body.email.trim());
        // console.log("floor_name : " + body.floor_name);
        // console.log("slot_number : " + body.slot_number);
        // console.log("checkin_time: " + body.checkin_time);
        // console.log("checkout_time: " + body.checkout_time);

        //Query to search in the booking table
        var searchQuery = {
            email : body.email.trim(),
            floor_name : body.floor_name,
            slot_number : body.slot_number,
            checkin_time : body.checkin_time,
            checkout_time : body.checkout_time
        };

        //Get the bookings and remove
        Booking.find(searchQuery).remove(function(err) {
            if (err) {
                console.log(err);
                res.send(err);
            }

            res.json(
            {
                status: 200
            });
        });
    }
);

router.get('/getFloors',
    function(req, res) {
        console.log("In getFloors API");
        var searchQuery = {
            floor_name : {$ne : 'black'}
        };

        var columns = {
            _id : 0,
            floor_name : 1
        };

        Parking_lot.distinct("floor_name", searchQuery, function(err, floor) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            console.log(floor);
            /*var tempFloor = new Array();
            for (var i = floor.length; i++) {
                tempFloor.push(floor[i]);
            };*/

            res.json(
            {
                status: 200,
                floors : floor
            });
        });
    }
);

function isTokenValid(req, res, next) {
    var body = req.body;
    console.log("token : " + body.token.trim());

    var searchQuery = {
        $or : [
            {'local.token' : body.token.trim()},
            {'facebook.token' : body.token.trim()},
            {'google.token' : body.token.trim()}
        ]
    };

    User.find(searchQuery, function(err, user) {
        if (err) {
            res.redirect('/');
        }
        console.log("Users..." + user);
        console.log("Users length :: " + user.length);
        if(user.length != 0) {
            return next();        
        }

        res.send(
            {
                status   : 302,
                redirect : '/'
            }
        );
    });

}

module.exports = router;