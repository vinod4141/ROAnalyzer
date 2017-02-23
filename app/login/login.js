'use strict';

angular.module('ROAnalyzer.login', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login/login.html',
    controller: 'LoginCtrl'
  });
}])

.controller('LoginCtrl', ['$scope', '$http', '$rootScope','$location', function($scope, $http, $rootScope, $location) {

    console.log("Reached Login Controller");
    $scope.name = '';
    $scope.pwd = '';


    $scope.logon = function(){
        console.log("Reached this place");

         var config = {
             params: {
                 name: $scope.name,
                password: $scope.pwd
            }
         }
         $http.get('http://localhost:8080/LoginService/login', config).
                            then(function(response) {
                                 $scope.lresponse = response.data;
                                 console.log($scope.lresponse.code);
                                 if($scope.lresponse.code == 0 ){
                                     $rootScope.isLogged = true;
                                 } else {
                                     $scope.errormsg = $scope.lresponse.message;
                                     console.log($scope.errormsg);
                                     $rootScope.isLogged = false;
                                }
                                 $location.path('/analytics');
                             });
    }



}]);
