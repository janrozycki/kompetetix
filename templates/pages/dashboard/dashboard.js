angular.module('MortApp.dashboard', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboard', {
    templateUrl: 'templates/pages/dashboard/dashboard.html',
    controller: 'dashboardCtrl'
  });
}])

.controller('dashboardCtrl', ['$scope', '$http', function($scope, $http) {
	$http({method: 'GET', url: 'static_resources/dzialy/procesy/procesy.json'}).success(function(response){
		$scope.procesy = response;
		$scope.liczbaProcesow = response.length;
	});
	$http({method: 'GET', url: 'static_resources/uzytkownicy/uzytkownicy.json'}).success(function(response){
		$scope.uzytkownicy = response;
		$scope.liczbaUzytkownikow = response.length;
	});
	$http({method: 'GET', url: 'static_resources/stanowiska/stanowiska.json'}).success(function(response){
		$scope.stanowiska = response;
		$scope.liczbaStanowisk = response.length;
	});
	$http({method: 'GET', url: 'static_resources/dzialy/dzialy.json'}).success(function(response){
		$scope.dzialy = response;
		$scope.liczbaDzialow = response.length;
	})
}]);
