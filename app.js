angular.module("MortApp", [
	'ngRoute',
	'MortApp.dashboard',
	'MortApp.dzial',
	'MortApp.dzialy',
	'MortApp.pracownik',
	'MortApp.pracownicy',
	'MortApp.proces',
	'MortApp.kompetencje',
	'MortApp.customFilters',
	'ui.materialize'
	])
.config(['$routeProvider', function($routeProvider){
	$routeProvider
	.when('/',{redirectTo: '/dashboard'})
	.otherwise({redirectTo: '/dashboard'});
}]);

