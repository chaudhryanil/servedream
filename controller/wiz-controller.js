module.exports = function(app) {
    var mongoose = require('mongoose');
    var spoon = require('../utils/spoonsnfork');

    app.post('/upload', function(req, res) {
        accModel = mongoose.model('Account');
        trxModel = mongoose.model('Transaction');


        var accountId = 0;
    	var newAccount = req.body;
        accModel.create( {
            name        : newAccount.Name,
            number      : newAccount.Number,
            finInstt    : newAccount.FinancialInstitution,
            firstHolder : newAccount.FirstHolder,
            secHolder   : newAccount.SecondHolder,
            openDate    : newAccount.OpenDate,
            closed      : false,
            type        : 'SB'
        }, function(err, account, count) {
                if (err) {
                    //res.status(400).json({status : -1, Comments : "Error in Saving Account"});
                    console.log("error in saving account");
                }
                else {
                    console.log("Successfully saved account");
                    var trxs = spoon.trxToJson(account._id, newAccount.Transactions);
                    trxModel.create(trxs, function(err, alltrxs, count){
                        if (err)
                            console.log('Error in loading transactions');
                        else {
                            console.log('loaded the transactions susccessfully');
                        }
                    })

                }
            });
            res.sendStatus("Ok");
    });

    app.post('/upload/investments', function(req, res) {
        accModel = mongoose.model('Account');
        trxModel = mongoose.model('Investment');


        var accountId = 0;
        var newAccount = req.body;
        accModel.create( {
            name        : newAccount.Name,
            number      : newAccount.Number,
            finInstt    : newAccount.FinancialInstitution,
            firstHolder : newAccount.FirstHolder,
            secHolder   : newAccount.SecondHolder,
            openDate    : newAccount.OpenDate,
            closed      : false,
            type        : 'ISA'
        }, function(err, account, count) {
                if (err) {
                    //res.status(400).json({status : -1, Comments : "Error in Saving Account"});
                    console.log("error in saving account");
                }
                else {
                    console.log("Successfully saved account");
                    var trxs = spoon.trxToJson(account._id, newAccount.Transactions);
                    trxModel.create(trxs, function(err, alltrxs, count){
                        if (err)
                            console.log('Error in loading investments');
                        else {
                            console.log('loaded the investment susccessfully');
                        }
                    })

                }
            });
            res.sendStatus("Ok");
    });

}
