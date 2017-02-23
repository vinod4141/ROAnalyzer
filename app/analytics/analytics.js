/*
(function() { */
 /* "use strict";

  var app1 = angular.module("ROAnalyzer.analytics", ["ngTable"]);

  app1.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/analytics', {
    templateUrl: 'analytics/analytics.html',
    controller: 'anCtrl'
  });
}])

  app1.controller("anCtrl", anCtrl);
  anCtrl.$inject = ["NgTableParams", "$http", "$scope"];

  function anCtrl(NgTableParams, $http, $scope) {

     console.log("This is Analytics Controller");

     $scope.alertdata = [];
     $scope.data = [];
     $http.get('http://localhost:8081/farepricingservice/alerts').
        then(function(response) {
            $scope.alertdata = response.data;
           // console.log(JSON.stringify(response.data));
           // console.log(JSON.stringify($scope.alertdata));
        });

      console.log(JSON.stringify($scope.alertdata));
      $scope.alertTable = new NgTableParams({
          page:1,
          count:10
      }, {
          total: $scope.alertdata.length,
          getData: function(params){
              $scope.data = $scope.alertdata.slice((params.page() - 1) * params.count(), params.page() * params.count());
             // $defer.resolve($scope.data);
             //console.log(JSON.stringify($scope.alertdata));
          }
      });

      console.log(JSON.stringify($scope.alertdata));
   /* this.defaultConfigTableParams = new NgTableParams({}, { dataset: $scope.alertdata});
    this.customConfigParams = createUsingFullOptions();

    function createUsingFullOptions() {
      var initialParams = {
        count: 5 // initial page size
      };
      var initialSettings = {
        // page size buttons (right set of buttons in demo)
        counts: [],
        // determines the pager buttons (left set of buttons in demo)
        paginationMaxBlocks: 13,
        paginationMinBlocks: 2,
        dataset: $scope.alertdata
      };
      return new NgTableParams(initialParams, initialSettings);
    }*/
/*  }
})();

*/











var app = angular.module("ROAnalyzer.analytics", ["ngTable", "ngResource", "ngWebsocket", "ngMaterial", "ngMessages"]);
(function() {

   app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/analytics', {
    templateUrl: 'analytics/analytics.html',
    controller: 'anCtrl'
  });
   }]);



/*  app.factory('MyData', function($websocket) {
      // Open a WebSocket connection
      var dataStream = $websocket('ws://localhost:8080/farepricingservice/consume');

      var collection = [];
      console.log("Connection got");
      dataStream.onMessage(function(message) {
        //collection.push(JSON.parse(message.data));
        console.log("Message got is " + message) ;
      });

      var methods = {
        collection: collection,
        get: function() {
          dataStream.send(JSON.stringify({ action: 'get' }));
        }
      };

      return methods;
    }); */

  /*  app.run (function($websocket, $rootScope){
     var ws = $websocket.$new('ws://localhost:8080/farepricingservice/FareAlerts');

     console.log('Inside Run Method');
     ws.$on('$open', function (msg) {
       console.log (" Connection Opened - Awesome ");
       ws.$emit('hello', 'world'); // it sends the event 'hello' with data 'world'
       console.log("data from server " + msg);

       //ws.$close();
     });
     ws.$on('$close', function(){
         console.log("Closing the connection ");
     });

     ws.$on('$message', function(message){
         console.log("Message got is in Run is " + JSON.stringify(message));
         $rootScope.alertmessage = message;
     });

   }); */

  app.controller("anCtrl", anCtrl);
  anCtrl.$inject = ["NgTableParams", "$resource","$rootScope","$scope","$websocket", "$timeout", "$mdDialog"];

  function anCtrl(NgTableParams, $resource, $rootScope, $scope, $websocket, $timeout, $mdDialog) {
    // tip: to debug, open chrome dev tools and uncomment the following line
    //debugger;
   // $scope.MyData = MyData;
    //$rootScope.alertMessage = {};
    console.log("Inside Analytics Controller");


    $scope.alerts = [];
    this.alertParams = {};
    //console.log("Value of WS " + ws);
    var ws = $websocket.$new('ws://localhost:8080/farepricingservice/FareAlerts', 'reconnect:true');
    ws.$on('$open', function (msg) {
      console.log (" Connection Opened - Awesome ");
      ws.$emit('hello', 'world'); // it sends the event 'hello' with data 'world'
    //  console.log("data from server " + msg);

      //ws.$close();
    });
    ws.$on('$close', function(){
        console.log("Closing the connection ");
    });

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

    ws.$on('$message', function(message){
        console.log("Message got is in Run is " + JSON.stringify(message));
      //  $scope.alerts.push(message);
       $scope.alerts.splice(0,0,message);
        $timeout(angular.noop);
        console.log("Alert Scope Message " + $scope.alerts);
        this.alertParams = new NgTableParams({ }, {
          getData: function(params) {
            // ajax request to api
            return $scope.alerts;
          }
        });

        //ws.$close();
    });


    var Api = $resource("http://localhost:8080/farepricingservice/alertSample");
    this.tableParams = new NgTableParams({ page:1,
          count:10}, {
      getData: function(params) {
        // ajax request to api
        return Api.query(params.url()).$promise.then(function(data) {
          params.total(data.length); // recal. page nav controls
            console.log(data)
          return data;
        });
      }
    });

  }


})();
