let ProduceType = require('../models/produceType');
let async = require('async');
let Item = require('../models/item');



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
    }, function(err, results) {
        if(err) {return next(err)};
        if(results.produceType == null) {
            let err = new Error("Produce Type not found");
            err.status = 404;
            return next(err);
        }
        res.render('produce_type_detail', { title: results.produceType.name, produceType: results.produceType } );
    });
};

// Display create on GET
exports.producetype_create_get = function (req, res, next) {
    res.render("index", {title: "tbd"});
};
// Handle create on POST
exports.producetype_create_post = function (req, res, next) {
    res.render("index", {title: "tbd"});
};

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
    res.render("index", {title: "tbd"});
};
// Handle update request on POST 
exports.producetype_update_post = function (req, res, next) {
    res.render("index", {title: "tbd"});
};

