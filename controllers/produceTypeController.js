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
    async.parallel({
        // find produce type by id
        producetype: function(callback) {
            ProduceType.findById(req.params.id).exec(callback);
        },
        producetype_items: function(callback) {
            Item.find({ 'type': req.params.id}).exec(callback);
        },
    }, function(err, results) {
        if(err) {return next(err); }
        if(results.producetype == null) {
            res.redirect('store/producetypes');
        }
        res.render('produce_type_delete', { title: "Delete Produce Type",
        produce_type: results.producetype, items: results.producetype_items
        });
    });
};
// Handle delete on POST
exports.producetype_delete_post = function (req, res, next) {

    async.parallel({
        // find produce type
        producetype: function(callback) {
              ProduceType.findById(req.params.id).exec(callback)
          },
        // find items of produce type
          producetype_items: function(callback) {
            Item.find({ 'type': req.params.id }).exec(callback)
          },
      }, function(err, results) {
        // if error than return err
          if (err) { return next(err); }
          if (results.producetype_items.length > 0) { 
              res.render('produce_type_delete', { produce_type: producetype, items: producetype_items} )
          } else {
            ProduceType.findByIdAndDelete(req.body.producetypeid, function deleteProduceType(err) {
                if (err) { return next(err); }
                res.redirect('store/producetypes')
            })
          }

      });
    
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
exports.producetype_update_post = [
    // validate and require name
    validator.body('name', 'Produce Type name required').trim().isLength({ min: 1}),
    // sanitize name
    validator.sanitizeBody('name').escape(),

    // Process validated + sanitized request
    (req, res, next) => {
        // pull out errors
        const errors = validationResult(req);
        // create new Produce Type Object
        let producetype = new ProduceType({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id
        }
    );
    // check for errors
    if (!errors.isEmpty()) {
        // if errors render form with errors
        res.render('produce_type_create', { title: 'Create New Produce Type', produce_type: producetype,
        errors: errors.array() });
        return;
    }
    else {
        // Data is valid => update produce type
        ProduceType.findByIdAndUpdate(req.params.id, producetype, {}, function (err, theproducetype) {
            if (err) { return next(err); }
            res.redirect(theproducetype.url);
        });
      }
    }
];