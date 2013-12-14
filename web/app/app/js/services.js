'use strict';

/* Services */
// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
.value('version', '0.1')
.factory('apigeeDataService', ['$http', function($http) {

	var apigee = {
		//allData: undefined,
		entities: undefined,
		refreshSensorData: function() {
			$http({method: 'GET', url: 'https://api.usergrid.com/dpacmittal/smartride/data?access_token=YWMtUb-iomSwEeO37neVzQ_UIwAAAUMU2UVKeqDJX-ONKdlr3hFOIdCavLPO4f8&limit=600'}).
				  success(function(data, status, headers, config) {
					  console.log("Data from app services:" + data + "\n, with status: " + status);
					  console.log(data);
					  apigee.allData = data;
					  apigee.entities = data.entities;
				  }).
				  error(function(data, status, headers, config) {
					  console.log("Error in http request to  app services:" + data+ "\n with status: " + status);
				  });
		},
		deleteAll: function() {
			for (var i=0; i< apigee.entities.length; i++) {
				$http({method: 'DELETE', url: 'https://api.usergrid.com/dpacmittal/smartride/data/'+apigee.entities[i].uuid+'?access_token=YWMtUb-iomSwEeO37neVzQ_UIwAAAUMU2UVKeqDJX-ONKdlr3hFOIdCavLPO4f8'}).
					  success(function(data, status, headers, config) {
						  console.log("Data from app services:" + data + "\n, with status: " + status);
						  console.log(data);
						  apigee.allData = data;
						  apigee.entities = data.entities;
					  }).
					  error(function(data, status, headers, config) {
						  console.log("Error in http request to  app services:" + data+ "\n with status: " + status);
					  });
				}
			}
	};

	return apigee;
}]);
