let ProduceType = require('../models/produceType');
let async = require('async');
let Item = require('../models/item');

// Validator for create and update.
const validator = require('express-validator')
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.index = function(req, res) {
    async.parallel({
        // count items in store
        item_count: function (callback) {
            Item.countDocuments({}, callback);
        },
        // count types in store
        produce_type_count: function(callback) {
            ProduceType.countDocuments({}, callback);
        },
    }, function(err, results) {
        // render index page and pass in results as data.
        res.render('index', {title: 'Produce Stand Home',
         error: err,
         data: results
        });
    });
};

// Display all items on GET
exports.item_list = function (req, res, next) {

    Item.find({}, 'name type')
    .populate('type')
    .exec(function(err, list_items) {
        if(err) {return next(err);}
        // on success render
        res.render("item_list", {title: "All Items", item_list: list_items});
    });
};
// Display item by id on GET 
exports.item_detail = function (req, res, next) {
    
    async.parallel({
        item: function(callback) {
            Item.findById(req.params.id)
            .populate('type')
            .exec(callback);
        },
    }, function(err, results) {
        if(err) {
            return next(err);
        }
        if(results.item == null) {
            let err = new Error('Item not found');
            err.status = 404;
            return next(err);
        }
        res.render('item_detail', {title: results.item.name, item: results.item} );
    });
};

// Display item create form on GET
exports.item_create_get = function (req, res, next) {
    ProduceType.find({}, 'name')
    .exec(function (err, produce_types) {
        if (err) { return next(err); }
        res.render("item_create", {title: "Create New Item:", producetypes: produce_types})
    });
};

// Handle item create on POST
exports.item_create_post = [
    // convert item to an array.
    
    (req, res, next) => {
        if(!(req.body.producetype instanceof Array)){
            if(typeof req.body.producetype==='undefined')
            req.body.producetype=[];
        } else {
            req.body.genre=new Array(req.body.producetype);
        }
        next();
    },
    
    // validate fields
    body('name', 'Name must not be empty').trim().isLength({ min: 1}),
    body('price', 'Price must be included').trim().isLength({ min: 1}),
    body('quantity', 'Quantity must be included').trim().isLength({ min: 1}),

    // sanitize all fields
    sanitizeBody('*').escape(),

    // process validated + sanitized request
    (req, res, next) => {
        // catch errors
        const errors = validationResult(req);
        // create new item object
        let item = new Item({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            portion: req.body.portion,
            type: req.body.producetype
        });

        // check for errors
        if (!errors.isEmpty()) {
            res.render("item_create", { title: "Create New Item", item: item, errors: errors})
        } else {
            // It's valid, save it!
            item.save(function (err) {
                if(err) { return next(err); }
                res.redirect(item.url);
            });
        }
    }
];

// Display item delete on GET
exports.item_delete_get = function (req, res, next) {
    
    async.parallel({
        // find produce type by id
        item: function(callback) {
            Item.findById(req.params.id).exec(callback);
        },
    }, function(err, results) {
        if(err) {return next(err); }
        if(results.item == null) {
            res.redirect('store/items');
        }
        res.render('item_delete', { title: "Delete Item", item: results.item, });
    });
};
// Handle item delete on POST 
exports.item_delete_post = function (req, res, next) {

    async.parallel({
        // find item
        item: function(callback) {
              Item.findById(req.params.id).exec(callback)
          },
      }, function(err, results) {
        // if error than return err
          if (err) { return next(err); }
          else {
            // no errors so delete
            Item.findByIdAndDelete(req.body.itemid, function deleteItem(err) {
                if (err) { return next(err); }
                res.redirect('../../../store/items')
            })
          }
      });
    
};




// Display item update on GET 
exports.item_update_get = function (req, res, next) {
    async.parallel({
        item: function(callback) {
            Item.findById(req.params.id).populate('type')
            .exec(callback);
        },
        produce_types: function(callback) {
            ProduceType.find({}, "name")
            .exec(callback)
        }
    },function(err, results) {
        if(err) {return next(err)}
        if(results.item == null) {
            let err = new Error("item not found")
            err.status = 404;
            return next(err);
        }
        res.render("item_create", {title: "Update Item", item: results.item, producetypes: results.produce_types})
    });
};

// Handle item update on POST 
exports.item_update_post = [
        // convert item to an array.
    
        (req, res, next) => {
            if(!(req.body.producetype instanceof Array)){
                if(typeof req.body.producetype==='undefined')
                req.body.producetype=[];
            } else {
                req.body.genre=new Array(req.body.producetype);
            }
            next();
        },
        
        // validate fields
        body('name', 'Name must not be empty').trim().isLength({ min: 1}),
        body('price', 'Price must be included').trim().isLength({ min: 1}),
        body('quantity', 'Quantity must be included').trim().isLength({ min: 1}),
    
        // sanitize all fields
        sanitizeBody('*').escape(),
    
        // process validated + sanitized request
        (req, res, next) => {
            // catch errors
            const errors = validationResult(req);
            // create new item object
            let item = new Item({
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                quantity: req.body.quantity,
                portion: req.body.portion,
                type: req.body.producetype,
                _id: req.params.id
            });
    
            // check for errors
            if (!errors.isEmpty()) {
                res.render("item_create", { title: "Create New Item", item: item, errors: errors})
                return;
            } else {
                Item.findByIdAndUpdate(req.params.id, item, {}, function (err, theitem) {
                    if (err) { return next(err); }
                    res.redirect(theitem.url);
                });
            }
        }
];
