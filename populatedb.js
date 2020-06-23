#! /usr/bin/env node

// https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose
// to run:
// node populatedb "mongodb+srv://Admin:Admin@cluster0-bkvrt.mongodb.net/produce_stand?retryWrites=true&w=majority"


console.log('This script populates some test produce types and produce items to the server');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/

// get models
var async = require('async')
var Item = require('./models/item')
var ProduceType = require('./models/produceType')

// set up mongoDB
var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// items and types arrays
var items = []
var producetypes = []


// Create Produce Types
function produceTypeCreate(name, description, cb) {
  // define object
  let produceType = new ProduceType({
      name: name,
      description: description
  });
  
  // save
  produceType.save(function (err) {
      // if err send err
      if (err) {
          cb(err, null);
          return;
      }
      // console to show and push to producetypes array
      console.log('New Produce Type: ' + produceType)
      producetypes.push(produceType)
      cb(null, produceType);
  }   );
}

// Create Vegetable item
function itemCreate(name, description, price, quantity, portion, type, cb) {
    itemdetail = {
        name: name,
        description: description,
        price: price,
        quantity: quantity,
        portion: portion,
        type: type,
    }
    let item = new Item(itemdetail);
    item.save(function (err) {
        if(err) {
            cb(err, null)
            return
        }
        console.log('New Item: ', + item);
        items.push(item)
        cb(null, item)
    });
}

// Create multiple produce types
function createProduceTypes(cb) {
    async.series([
        function(callback) {
          produceTypeCreate('Greens', 'Leafy Greens', callback)
        },
        function(callback) {
          produceTypeCreate('Lettuces', 'Lettuces', callback)
        },
        function(callback) {
          produceTypeCreate('Root Vegetables', 'Root Vegetables', callback)
        },
        function(callback) {
          produceTypeCreate('Tomatoes', 'Tomatoes', callback)
        },
        function(callback) {
          produceTypeCreate('Herbs', 'Fresh Herbs From the Garden', callback)
        },
        ],
        // optional callback
        cb);
}


// create multiple store items
function createItems(cb) {
    async.series([
        function(callback) {
            itemCreate(
                'Romaine', 
                'Classic Romaine Hearts, Toss them in a Caesar Salad, or Chop them fine for a taco night.',
                5.00,
                5,
                '3 Heads to a Bag',
                [producetypes[0], producetypes[1],],
                callback
                );
        },
        function(callback) {
            itemCreate(
                'Roma Tomatoes', 
                'Fresh Roma Tomatoes. Great for salads or pizza topping',
                3.00,
                3,
                '3 Tomatoes to a pack',
                [producetypes[3], ],
                callback
                );
        },
    ],
    cb);
}


async.series([
    createProduceTypes,
    createItems,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('Items: '+items);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});