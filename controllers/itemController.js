let ProduceType = require('../models/produceType');
let async = require('async');
let Item = require('../models/item');

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
        console.log(list_items)
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
    res.render("item_create", {title: "tbd"});
};
// Handle item create on POST
exports.item_create_post = function (req, res, next) {
    res.render("item_detail", {title: "tbd"});
};

// Display item delete on GET
exports.item_delete_get = function (req, res, next) {
    res.render("item_delete", {title: "tbd"});
};
// Handle item delete on POST 
exports.item_delete_post = function (req, res, next) {
    res.render("item_delete", {title: "tbd"});
};

// Display item update on GET 
exports.item_update_get = function (req, res, next) {
    res.render("item_create", {title: "tbd"});
};
// Handle item update on POST 
exports.item_update_post = function (req, res, next) {
    res.render("item_detail", {title: "tbd"});
};
