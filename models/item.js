let mongoose = require('mongoose');

let Schema = mongoose.Schema;

// define produce type
let ItemSchema = new Schema ({
    name: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: String, required: true},
    quantity: {type: String, required: true},
    portion: {type: String, required: true},
    type: [{type: Schema.Types.ObjectId, ref: 'ProduceType'}]
})

// virtual for url
ItemSchema
.virtual('url')
.get(function () {
  return '/store/item/' + this._id;
});

// export produce type
module.exports = mongoose.model('Item', ItemSchema);