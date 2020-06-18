let mongoose = require('mongoose');

let Schema = mongoose.Schema;

// define item schema
let ProduceTypeSchema = new Schema ({
    name: {type: String, required: true},
    description: {type: String, required: true},
})

// virtual for url
ProduceTypeSchema
.virtual('url')
.get(function () {
  return '/store/producetype/' + this._id;
});

// export item schema
module.exports = mongoose.model('ProduceType', ProduceTypeSchema);
