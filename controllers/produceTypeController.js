let ProduceType = require('../models/produceType');
let async = require('async');
let Item = require('../models/item');

// Validator for create and update.
const validator = require('express-validator')
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');



// Display all produce types on GET
exports.producetype_list = function (req, res, next) {
    ProduceType.find({}, 'name')
    .exec(function(err, list_types) {
        console.log(list_types)
        if(err) {return next(err);}
        res.render("produce_type_list", {title: "All Produce Types", produce_type_list: list_types});
    })
};
// Display details on GET
exports.producetype_detail = function (req, res, next) {
    async.parallel({
        produceType: function (callback) {
            ProduceType.findById(req.params.id)
            .exec(callback);
        },
        items_type: function (callback) {
            Item.find({ 'type': req.params.id })
            .exec(callback);
        },
    }, function(err, results) {
        if(err) {return next(err)};
        if(results.produceType == null) {
            let err = new Error("Produce Type not found");
            err.status = 404;
            return next(err);
        }
        res.render('produce_type_detail', { title: results.produceType.name, produceType: results.produceType, type_items: results.items_type } );
    });
};

// Display create on GET
exports.producetype_create_get = function (req, res, next) {
    res.render("produce_type_create", {title: "create new produce type"});
};

// Handle create on POST
exports.producetype_create_post = [
    // require name and trim spaces on end
    validator.body('name', 'Produce name required').trim().isLength({ min: 1}),
    // clean up name
    validator.sanitizeBody('name').escape(),

    // Process validated request.
    (req, res, next) => {
        // Check for validation errors
        const errors = validator.validationResult(req);
        // Create new produce type object
        let producetype = new ProduceType(
            {
                name: req.body.name,
                description: req.body.description,
            }
        );
        // check for errors
        if (!errors.isEmpty()) {
            // if errors return create form with errors
            res.render('produce_type_create', { title: 'create new produce type', produce_type: producetype, erros: erros.array()});
            return
        }
        else {
            // Data is valid
            // Check for redundancies in produce type
            ProduceType.findOne({ 'name': req.body.name })
            .exec( function(err, found_type) {
                if(err) {return next(err);}
                if (found_type) {
                    // redirect to redundant url
                    res.redirect(found_type.url)
                }
                else {
                    producetype.save(function (err) {
                        if (err) { return next(err); }
                        res.redirect(producetype.url)
                    });
                }
            });
        }
    }
]
// Display delete on GET
exports.producetype_delete_get = function (req, res, next) {
    res.render("index", {title: "tbd"});
};
// Handle delete on POST
exports.producetype_delete_post = function (req, res, next) {
    res.render("index", {title: "tbd"});
};

// Display update screen on GET
exports.producetype_update_get = function (req, res, next) {
    async.parallel({
        produceType: function (callback) {
            ProduceType.findById(req.params.id)
            .exec(callback);
        },
    }, function (err, results) {
        if(err) { return next(err)}
        if(results.produceType == null) {
            let err = new Error("produce type not found")
            err.status = 404;
            return next(err);
        }
        res.render("produce_type_create", {title: results.produceType.name, produce_type: results.produceType});

    });
};
// Handle update request on POST 
exports.producetype_update_post = function (req, res, next) {
    res.render("index", {title: results.produceType.name, produce_type: results.produceType});
};

