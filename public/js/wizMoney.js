/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function() {
    var app = angular.module('wizMoney', []);
    
    console.log("App created");
    
    
    
     app.factory('wizFileReader', [ '$rootScope', '$http', function($rootScope, $http) {
    	 
    	 var myReader = {};
    	 
    	 console.log("Inside defintion of service");
    	    
         myReader.getFileContents = function (event)
         {
         	
            var fileTxt = event.target.result;
            console.log("inside getting contents");
            console.log(fileTxt);
            var req = {
            		 method: 'POST',
            		 url: 'http://localhost:3000/upload',
            		 headers: {
            		   'Content-Type': 'text/plain'
            		 },
            		 data: fileTxt
            		};
            
            $http(req).success(function(response) {
         	   console.log(fileTxt);
         	   console.log(response);
            });
         };

         myReader.readFile = function (file) {
                if (!file.type.match('plain')) {
                    alert ("not text file");
                    return ;
                };
               
                console.log("before reading request");
               
                var txtFileReader = new FileReader();
                txtFileReader.onloadend = myReader.getFileContents;
                txtFileReader.readAsText(file);
                console.log("after reading request")
           };
            
           
            
            return myReader;
            

            
    }]);
   
    
    app.controller('wizController', ['$scope', '$http', 'wizFileReader', function($scope, $http, wizFileReader) {
        //$scope.fileObj;
        $scope.fileText = "";
        $scope.staticText = "This is to test variables";
    
        console.log("I am in controller");
        
        $scope.setFile = function(element) {
            console.log("Inside setting the file");
            console.log(element.files[0]);
            $scope.fileObj = element.files[0];
            
            console.log($scope.fileObj);
            
        };
        
        $scope.importFile = function() {
        	console.log("Inside import file, ");
        	console.log($scope.fileObj);
        	wizFileReader.readFile($scope.fileObj);
        };
    	
    }]);

    
    
})();

