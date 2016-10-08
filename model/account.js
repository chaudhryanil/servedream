mongoose = require('mongoose');
var Schema = mongoose.Schema;

var accountSchema = new Schema({
    name        : String,
    number      : Number,
    finInstt    : String,
    firstHolder : String,
    secHolder   : String,
    openDate    : Date,
    closed      : Boolean,
    type        : String
});

var Account = module.exports = mongoose.model('Account', accountSchema);
