let mongoose = require('mongoose');

let Schema = mongoose.Schema;

// define item schema
let ItemSchema = new Schema ({
    name: {type: String, required: true},
    description: {type: String, required: true},
})

// virtual for url
ItemSchema
.virtual('url')
.get(function () {
  return '/store/item/' + this._id;
});

// export item schema
module.exports = mongoose.model('Item', ItemSchema);
