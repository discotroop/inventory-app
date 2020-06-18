let mongoose = require('mongoose');

let Schema = mongoose.Schema;

// define produce type
let ProduceType = new Schema ({
    name: String,
    description: String,
    url: String
})

// export produce type
module.exports = mongoose.model('ProduceType', ProduceType);