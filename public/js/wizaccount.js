
    var app = angular.module('wizaccount', []);



    app.factory("Account", function accountFactory() {
       function Account() {
         this.Name = "";
         this.Number = 0;
         this.FirstHolder = "";
         this.SecondHolder = "";
         this.OpenDate = new Date();
         this.FinancialInstitution = "";
         this.Transactions = "";

       }
       return (new Account);

     });

     app.service("AccountService", ["Account", "TrnFileReader", function(Account, TrnFileReader) {

       var dataLoaded = false;
       //var AccountService = new Object();
       this.setupNewAccount = function(acname, acnum, firstholder, secholder, opendate, bankName) {
         Account.Name = acname;
         Account.Number = acnum;
         Account.FirstHolder = firstholder
         Account.SecondHolder = secholder
         Account.OpenDate = opendate
         Account.FinancialInstitution = bankName
         Account.Transactions = "";
         this.dataLoaded = false;
       }

       this.setTransactions = function(file) {
         var promise = new Promise(function (resolve, reject) {
           console.log(file);
           var promiseMeTransactions = TrnFileReader.readTransactions(file);
           promiseMeTransactions.then(function (txs) {
             console.log("promised trxs " + txs);
             Account.Transactions = txs;
             this.dataLoaded = true;
             console.log("Status of Data Loaded is ---- " + this.dataLoaded);
             resolve();
           });
         });
         return promise;
       };

       this.getAccountJSON = function() {
         console.log("transactions in the account ..... " + Account.Transactions);

         return (JSON.stringify(Account));
       };
       this.isDataLoaded = function() {
         //console.log("Status of Data Loaded is ---- " + this.dataLoaded);
         return this.dataLoaded;
       }



     }]);

     app.factory('TrnFileReader', function() {

       console.log("object created");

       var trnFileReader = { };

          trnFileReader.readTransactions = function(file) {
            var promise = new Promise(function (resolve, reject) {
              if (file) {
                if (!(file.type.match('plain|csv'))) {
                    console.log("Selected file is not a text file " + file.type);
                    return ;
                };
                console.log("before reading request" + file);

                var txtFileReader = new FileReader();
                txtFileReader.onloadend = function(event) {
                            this.transactions = event.target.result;
                            //console.log("Inside transactions Reading - " + this.transactions);
                            resolve(event.target.result);
                }
                console.log("Reading as text");
                txtFileReader.readAsText(file);

              } else {
                  console.log("File object is undefined");
                  reject("File Read Error");
              };
            })
            return promise;
         };

         /*trnFileReader.transactionSize = function() {
           return this.transactions.length;
         }

         trnFileReader.getTransactions = function() {

                 return this.transactions;
         };*/

       return trnFileReader;

     });


     app.controller('accountcontroller', ['$rootScope', '$scope', '$http', 'AccountService', function($rootScope, $scope, $http, AccountService)
     {
           /*$scope.accName = "ANIL-FED-SB";
           $scope.accNumber = "152800008193"
           $scope.firstHolder = "Chaudhry, Anil Kumar"
           $scope.secHolder = ""
           $scope.accOpenDate = new Date("01/01/2005");
           $scope.bankName = "Federal Bank"*/



           $scope.createNew = function() {
             AccountService.setupNewAccount($scope.accName, $scope.accNumber, $scope.firstHolder, $scope.secHolder, $scope.accOpenDate, $scope.bankName);
             console.log("Before calling setTrn");
             promisetoSet = AccountService.setTransactions($scope.fileObj);
             promisetoSet.then(function() {
               var requestData = AccountService.getAccountJSON();
               console.log("Account Data Loaded is " + requestData);
               var req = {
               		 method: 'POST',
               		 url: 'http://localhost:3000/upload',
               		 headers: {
               		   'Content-Type': 'application/json'
               		 },

               	};
                req.data = requestData;
                console.log(requestData);
               $http(req);

             });
            }


           $scope.setFile = function(elem) {
             console.log("setting file object");
             $scope.fileObj = elem.files[0];

           }

           $scope.listAllAccounts = function() {

               //window.alert("Inside account list");
               $scope.accounts = [
                   {
                       "name"   : "ANIL-FED-SB",
                       "number" : "15280100008193",
                       "firstholder" : "ANIL KUMAR CHAUDHRY",
                       "secondholder" : "",
                       "bank"   : "Federal Bank",
                       "type"   : "Savings Bank"
                   },
                   {
                       "name"   : "ANIL-KMBL-SB",
                       "number" : "026501006087",
                       "firstholder" : "ANIL KUMAR CHAUDHRY",
                       "secondholder" : "",
                       "bank"   : "Kotak Bank",
                       "type"   : "Savings Bank"
                   },
                   {
                       "name"   : "ANIL-ICICI-SB",
                       "number" : "0021023466587",
                       "firstholder" : "ANIL KUMAR CHAUDHRY",
                       "secondholder" : "",
                       "bank"   : "ICICI Bank",
                       "type"   : "Savings Bank"
                   }

               ];

               //window.alert($scope.accounts[0].name);



           }
           $scope.listAllAccounts();

     }]);
