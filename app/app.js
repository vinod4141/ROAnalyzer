'use strict';

// Declare app level module which depends on views, and components
angular.module('ROAnalyzer', [
  'ngRoute',
  'ROAnalyzer.login',
  'ROAnalyzer.dashboard',
  'ROAnalyzer.version',
  'ROAnalyzer.analytics'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/login'});
}]);
