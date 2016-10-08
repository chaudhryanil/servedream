var mongoose = require('mongoose');

var dbURI = 'mongodb://localhost:27017/money';

mongoose.connect(dbURI);

mongoose.connection.on('connected', function() {
    console.log('Database is connected .....');
});

mongoose.connection.on('error', function(err) {
    console.log('Database connection error.... ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Database disconnected.......');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('database connection disconnected through app termination');
    process.exit(0);
  });
});


require('../model/account');
require('../model/transaction');
