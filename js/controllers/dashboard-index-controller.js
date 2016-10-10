angular.module('MortApp')
.controller('DashboardIndexController', function($http){
	var controller = this;
	$http({method: 'GET', url: '/static_resources/procesy.json'}).success(function(data){
		controller.procesy = data;
	});
});