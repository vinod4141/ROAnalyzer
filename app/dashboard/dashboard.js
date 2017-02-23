/*'use strict';

angular.module('ROAnalyzer.dashboard', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl: 'dashboard/dashboard.html',
    controller: 'dashCtrl'
  });
}])

.controller('dashCtrl',['$scope', '$http', function($scope, $http) {

    console.log("This is Dashboard Controller");

     $scope.alerts = [];
     $http.get('http://localhost:8080/farepricingservice/alerts').
        then(function(response) {
            $scope.alerts = response.data;

        });

    $scope.itemsByPage=5;
    $scope.message = "Binding Proper";
}]);*/

var app = angular.module("ROAnalyzer.dashboard", ["ngTable", "ngResource", "ui.bootstrap", "ngMaterial", "ngMessages"]);
(function() {

   app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl: 'dashboard/dashboard.html',
    controller: 'dashCtrl'
  });
   }]);
  app.controller("dashCtrl", dashCtrl);
  dashCtrl.$inject = ["NgTableParams", "$resource", "$filter", "$scope", "$uibModal", "$mdDialog"];

  function dashCtrl(NgTableParams, $resource, $filter, $scope, $uibModal, $mdDialog) {
    // tip: to debug, open chrome dev tools and uncomment the following line
    //debugger;
    console.log("Inside Dashboard Controller");
    var Api = $resource("http://localhost:8080//farepricingservice/alerts");
    this.tableParams = new NgTableParams({

    }, {
        getData: function(params) {
        // ajax request to api
        return Api.query(params.url()).$promise.then(function(data) {
        params.total(data.length); // recal. page nav controls
            console.log(data);

        var filterObj = params.filter(),
            filteredData = $filter('filter')(data, filterObj);
          return filteredData;
        });
      }
    });

    var dialogOptions = {
      controller: 'editCtrl',
      templateUrl: 'alertEdit.html'
    };

/*    $scope.edit = function(item){

      var itemToEdit = item;
      $dialog.dialog(angular.extend(dialogOptions, {resolve: {item: angular.copy(itemToEdit)}}))
      .open()
      .then(function(result){
        if(result){
          angular.copy(result, itemToEdit);
        }
        itemToEdit = undefined;
      });
    }; */

    $scope.showPrompt = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.prompt()
      .title('Please add your remarks')
      .textContent('Actioned Remarks')
      .placeholder('Remarks')
      .ariaLabel('Remarks')
      .initialValue('')
      .targetEvent(ev)
      .ok('Submit')
      .cancel('Cancel');

    $mdDialog.show(confirm).then(function(result) {
      $scope.status = 'You decided to name your dog ' + result + '.';
    }, function() {
      $scope.status = 'You didn\'t name your dog.';
    });
  };



  }

  function editCtrl($scope , item , dialog){
    $scope.item = item;

    $scope.save = function(){
      dialog.close($scope.item);
    }
    $scope.close = function(){
      dialog.close(undefined);
    };
  }
})();
