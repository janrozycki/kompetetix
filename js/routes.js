angular.module('MortApp')

.config(function($routeProvider){
	$routeProvider
	.when('/dashboard',{
		templateUrl: '/templates/pages/dashboard/dashboard.html',
		controller: 'DashboardIndexController',
		controllerAs: 'dashboardIndexCtrl',
		replace: true
	})
	.when('/dzial',{
		templateUrl: '/templates/pages/dzial/dzial.html'
	})
	.when('/dzialy',{
		templateUrl: '/templates/pages/dzialy/dzialy.html'
	})
	.when('/pracownicy',{
		templateUrl: '/templates/pages/pracownicy/pracownicy.html'
	})
	.when('/pracownik',{
		templateUrl: '/templates/pages/pracownik/pracownik.html'
	})
	.when('/proces',{
		templateUrl: '/templates/pages/proces/proces.html'
	})
	.when('/',{redirectTo: '/dashboard'})
	.otherwise({redirectTo: '/'});
});