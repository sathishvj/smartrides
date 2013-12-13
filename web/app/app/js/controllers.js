'use strict';

/* Controllers */

angular.module('myApp.controllers', [])
    .controller('NavCtrl', ["$scope", "$http", "$location", "optionsService",  '$route', 'projectService', function ($scope, $http, $location, optionsService, $route, projectService) {
		switch($location.path()) {
			case "":
			case "/home":
				$scope.activeLink = "Home";
				break;
			case "/about":
				$scope.activeLink = "About";
				break;
			case "/sensors":
				$scope.activeLink = "Sensors";
				break;
			case "/bikes":
				$scope.activeLink = "Bikes";
				break;
			case "/Biker Gangs":
				$scope.activeLink = "BikerGangs";
				break;
			case "/feedback":
				$scope.activeLink = "Feedback";
				break;
		}

        $scope.setActive = function (selLink) {
			//this call doesn't seem to stop the page from reloading when clicking an already selected link
			if ($scope.activeLink === selLink) {
				return;
			}
            $scope.activeLink = selLink;
        };

		$scope.showHelp = false;

        $scope.loggedIn = false;
        $scope.user = {};
        $scope.logIn = function () {
            $http.get("user/loginurl").success(function (data) {
                console.log("Loginurl Data received: ", data);
				//console.log(data);
				var loginUrl = data.Data.Login;
				var logoutUrl = data.Data.Logout;
				//console.log(data);
				console.log(loginUrl);
				console.log(logoutUrl);
				//alert("login:" + loginUrl + "\nlogout: " + logoutUrl);
				if (loginUrl != "") {
					console.log("Changing path to " + loginUrl);
					//$location.path(loginUrl);
					window.location = loginUrl;
					//$scope.loggedIn = true;
				} else if (logoutUrl != "") {
					console.log("Changing path to " + logoutUrl);
					//$location.path(loginUrl);
					window.location = logoutUrl;
					//$scope.loggedIn = false;
				}
				//$scope.$apply();
			}).error(function(msg) {
				console.log("Error: " + msg.toString());
				alert("Error: " + msg.toString());
			});
        };

        $scope.logOut = function() {
            $scope.loggedIn = false;
            $scope.user = {};
        };

		$scope.startIntro = function (){
			var intro = introJs();
			intro.setOptions({
				steps: [
				{
					element: document.querySelector('.logo'),
					intro: "Usage: While having a conversation, leave this page open.  Occasionally glance at it, notice some interesting words, quotes, or phrases, and then slip it in elegantly into your conversation.  Using it will improve your vocabulary, language, and your conversations, and make you impressive.",
					position: 'right'
				},
				{
					element: document.querySelector('.wordBox'),
					intro: "Boxes like these show you content.  Hover over them to control them.",
					position: 'bottom'
				},
				{
					element: document.querySelector('.plusBox'),
					intro: "Google Plus box automatically gets content from Google Plus based on current project.",
					position: 'bottom'
				},
				{
					element: document.querySelector('.mapsBox'),
					intro: "If the content in any of the other boxes has a geographical context, this box will show that location from Google Maps.",
					position: 'bottom'
				},
				{
					element: document.querySelector('#projectList'),
					intro: "Preconfigured projects lets you choose a set for your current conversation or learning.",
					position: 'bottom'
				},
				{
					element: document.querySelector('#context-buttons'),
					intro: "Filter content based on your conversation or learning context and theme.",
					position: 'bottom'
				},
				{
					element: document.querySelector('#saveToGDrive'),
					intro: "Save content to a Google Drive file that you can then revise from, refer offline, print, or carry around.",
					position: 'bottom'
				},
				{
					element: document.querySelector('#socialbuttons'),
					intro: "Don't forget to give GlowSo some social networking love. Thank you!",
					position: 'bottom'
				}
			]
			});

			intro.start();
		};

    }])
	.controller("GoogleMapsCtrl", [ "$scope", "mapService", "optionsService", "$timeout", function($scope, mapService, optionsService, $timeout) {
		//$scope.options = optionsService.getOptions();

		angular.extend($scope, {
			center: {
				latitude: mapService.location.lat, // initial map center latitude
				longitude: mapService.location.lon // initial map center longitude
			},
			markers: [], // an array of markers,
			zoom: 4 // the zoom level
		});

		//var a = $scope.center;

		//$scope.center = {
			//latitude: 29,
			//longitude: 29 
		//};
		//var t = $timeout( function() { 
			//mapService.location = {"lat": 17, "lon": 57};
			//console.log(mapService.location); 
		//}, 2000);
		setInterval(function(){
			$scope.$apply(function() {
				$scope.center = {
					latitude:  Math.floor(Math.random()*90),
					longitude:  Math.floor(Math.random()*180)
				};
			});
		//}, 100000);
		}, 1000 * optionsService.getOptions().Maps.interval);

		//$scope.$watch("mapService.location", function(newVal, oldVal) {
			//console.log(newVal);
			//console.log(oldVal);
			//console.log("Here inside watch.");
			//console.log(location.lat, location.lon);
			//a.latitude = 88;
			//$scope.center = {
				//latitude: mapService.location.lat,
				//longitude: mapService.location.lon 
			//};
		//});
	}])
    .controller('SensorsCtrl', ["$scope", "$http", "$location", '$route', function ($scope, $http, $location, $route) {
		$scope.myData = [{name: "Moroni", age: 50},
			{name: "Tiancum", age: 43},
			{name: "Jacob", age: 27},
			{name: "Nephi", age: 29},
			{name: "Enos", age: 34}
		];

		$scope.gridOptions = { 
			data: 'myData',
			showGroupPanel: true,
			jqueryUIDraggable: true
		};
	}]);
