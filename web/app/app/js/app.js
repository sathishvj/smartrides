'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers', 'angularFileUpload', 'ngRoute', 'ngAnimate', 'ngSanitize', 'google-maps', 'ngGrid']).
  config(['$routeProvider', function($routeProvider) {
    //$routeProvider.when('/view1', {templateUrl: 'partials/boxes.html', controller: 'WordCtrl'});
    $routeProvider.when('/home', {templateUrl: 'partials/home.tpl.html'});
    $routeProvider.when('/about', {templateUrl: 'partials/about.tpl.html'});
    $routeProvider.when('/sensors', {templateUrl: 'partials/sensors.tpl.html', controller: 'SensorsCtrl'});
    $routeProvider.when('/bikes', {templateUrl: 'partials/bikes.tpl.html'});
    $routeProvider.when('/bikergangs', {templateUrl: 'partials/bikergangs.tpl.html'});
    $routeProvider.when('/feedback', {templateUrl: 'partials/feedback.tpl.html', controller: 'FeedbackCtrl'});
    $routeProvider.otherwise({redirectTo: '/home'});
  }]);
