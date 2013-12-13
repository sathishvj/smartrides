'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
.value('version', '0.2')
.service('optionsService', function() {
	var options = {
		"Min": 2,
		"Max": 60,
		"Quotes": {
			"interval": 2 
		},
		"Figuratives": {
			"interval": 2,
			"types": []
		},
		"Foreigns": {
			"interval": 2,
			"languages": []
		},
		"Putdowns": {
			"interval": 2 
		},
		"Maps": {
			"interval": 2 
		},
		"Plus": {
			"interval": 2 
		},
		"Words": {
			"interval": 5,
			"difficulty": "medium"
		}
	};

	/*
	 *var options = {
	 *    "Min": 2,
	 *    "Max": 60,
	 *    "Quotes": {
	 *        "interval": 15
	 *    },
	 *    "Figuratives": {
	 *        "interval": 12,
	 *        "types": []
	 *    },
	 *    "Foreigns": {
	 *        "interval": 11,
	 *        "languages": []
	 *    },
	 *    "Putdowns": {
	 *        "interval": 14
	 *    },
	 *    "Maps": {
	 *        "interval": 13
	 *    },
	 *    "Plus": {
	 *        "interval": 16
	 *    },
	 *    "Words": {
	 *        "interval": 9,
	 *        "difficulty": "medium"
	 *    }
	 *};
	 */

	var colors = {
		"Blue": "box-blue",
		"Cyan": "box-cyan"
	};

	this.getOptions = function() {
		return options;
	};

	this.setPutdownOptions = function(opt) {
		options.Putdowns = opt;
	};

	this.getColors = function() {
		return colors;
	};
})
.service('projectService', function() {
	var projects = {
		"English Glow": {
			"image": "img/england.png",
			"Words": {
				"get": "/words/English"
			},
			"Putdowns": {
				"get": "/putdowns/English"
			},
			"Quotes": {
				"get": "/quotes/English"
			},
			"Foreigns": {
				"get": "/foreigns/English"
			},
			"Figuratives": {
				"get": "/figuratives/English"
			}
		},
		"French Glow": {
			"image": "img/france.png",
			"Words": {
				"get": "/words/French"
			},
			"Putdowns": {
				"get": "/putdowns/French"
			},
			"Quotes": {
				"get": "/quotes/French"
			},
			"Foreigns": {
				"get": "/foreigns/French"
			},
			"Figuratives": {
				"get": "/figuratives/French"
			}
		}
	};

	var currentProject = "";
	this.setCurrentProject = function(name) {
		currentProject = projects[name];
		console.log("Current project: ", projects[name]);
	};

	this.getCurrentProject = function() {
		return currentProject;
	};

	this.getProjectNames = function() {
		//return ["English Glow", "French Glow"];
		//console.log(Object.keys(projects));
		return Object.keys(projects);
	};

	//first time set to default
	//this.setCurrent("English Glow");
	this.setCurrentProject(this.getProjectNames()[0]);
})
.service('mapService', function() {
	this.location = {
		"lat": 15.5,
		"lon": 80.5
	};

});
