var express = require('express');
var router = express.Router();

//Models
var Parking_lot = require('./models/parking_lot');

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

router.route('/parking_lots')

    /*// create a bear (accessed at POST http://localhost:8080/api/bears)
    .post(function(req, res) {
        
        var parking_lot = new Parking_lot();      // create a new instance of the Bear model
        parking_lot.floor_name = req.body.floor_name;  // set the bears name (comes from the request)
        parking_lot.slot_number = req.body.slot_number;
        parking_lot.is_available = req.body.is_available;

        // save the bear and check for errors
        parking_lot.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Bear created!' });
        });
        
    });*/

	// get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res, next) {
        Parking_lot.find(function(err, parking_lots) {
            if (err)
                res.send(err);

            res.json(parking_lots);
        });
    });

/*router.route('/parking_lots/:lot_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res, next) {
        Parking_lot.findById(req.params.lot_id, function(err, parking_lot) {
            if (err)
                res.send(err);
            res.json(parking_lot);
        });
    });*/


router.route('/parking_lots/:floor_name')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res, next) {
        Parking_lot.find({floor_name : req.params.floor_name }, function(err, parking_lot) {
            if (err)
                res.send(err);
            res.json(parking_lot);
        });
    });

//Get the avalable parking lot space searched by user
router.route('/parking_lots/:floor_name/:slot_number')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res, next) {
        Parking_lot.find(
        {
        	floor_name : req.params.floor_name,
        	slot_number : req.params.slot_number,
        	is_available : true
        }, function(err, parking_lot) {
            if (err)
                res.send(err);
            res.json(parking_lot);
        });
    });

module.exports = router;