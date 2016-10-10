angular.module('MortApp', [
	'ngRoute',
	'MortApp.dashboard',
	'MortApp.dzial',
	'MortApp.dzialy',
	'MortApp.pracownik',
	'MortApp.pracownicy',
	'MortApp.proces'
	])
.config(['$routeProvider', function($routeProvider){
	$routeProvider
	.when('/',{redirectTo: '/dashboard'})
	.otherwise({redirectTo: '/dashboard'});
}]);