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

// Display item create form on GET
exports.item_create_get = function (req, res, next) {
    res.render("index", {title: "tbd"});
};
// Handle item create on POST
exports.item_create_post = function (req, res, next) {
    res.render("index", {title: "tbd"});
};

// Display item delete on GET
exports.item_delete_get = function (req, res, next) {
    res.render("index", {title: "tbd"});
};
// Handle item delete on POST 
exports.item_delete_post = function (req, res, next) {
    res.render("index", {title: "tbd"});
};

// Display item update on GET 
exports.item_update_get = function (req, res, next) {
    res.render("index", {title: "tbd"});
};
// Handle item update on POST 
exports.item_update_post = function (req, res, next) {
    res.render("index", {title: "tbd"});
};

// Display item by id on GET 
exports.item_detail = function (req, res, next) {
    res.render("index", {title: "tbd"});
};
// Display all items on GET
exports.item_list = function (req, res, next) {
    res.render("index", {title: "tbd"});
};