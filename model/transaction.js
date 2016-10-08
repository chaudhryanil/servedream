mongoose = require('mongoose');
var Schema = mongoose.Schema;

var trxSchema = new Schema({
    date        : Date,
    mode        : String,
    refnum      : String,
    amount      : Number,
    payee       : String,
    memo        : String,
    maincatg    : String,
    subcatg     : String,
    taxexempt   : Boolean,
    account     : String
});

var trx = module.exports = mongoose.model('Transaction', trxSchema);
