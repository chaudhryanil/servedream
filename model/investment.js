mongoose = require('mongoose');
var Schema = mongoose.Schema;

var invSchema = new Schema({
    date            : Date,
    action          : String,
    security        : String,
    price           : Number,
    quantity        : Number,
    amount          : Number,
    memo            : String,
    commission      : Number,
    sectrantax      : Number,
    taxcatg         : String,
    account         : String,
    transferaccount : String,
    trframount      : Number,
    sectype         : String,
    seccode         : String,
    advisor         : String,
    folio           : String
});

var invtrx = module.exports = mongoose.model('Investment', invSchema);
