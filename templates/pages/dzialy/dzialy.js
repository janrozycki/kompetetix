'use strict';

angular.module('MortApp.dzialy', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dzialy', {
    templateUrl: 'templates/pages/dzialy/dzialy.html',
    controller: 'dzialyCtrl'
  });
}])

.controller('dzialyCtrl', ['$scope', '$http', '$q', '$route', function($scope, $http, $q, $route) {
    $scope.dzialy = {};
    $scope.dzialy_ids_array = [];
  
    $scope.customHTTPCall = function(IDsArray, arrayIndex, urlEnding){
        $http({method: 'GET', url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/dzialy/' + IDsArray[arrayIndex] + '/' + urlEnding}).success(function(response){
            $scope.dzialy[arrayIndex][urlEnding] = response;
        });
    };
    // funkcja która re-renderuje całą stronę
    $scope.reRender = function(){
        $route.reload();
    };
    $scope.hideModal = function(){
        $('#add-department').closeModal();
    };
    $scope.dodajDzial = function(){
        if($scope.procesyNowegoDzialu){
            var procesyDoWyslania = []
            for (var i = 0; i < $scope.procesyNowegoDzialu.length; i++) {
                procesyDoWyslania.push({"id": $scope.procesyNowegoDzialu[i]})
            }
        }
        $scope.procesyDoWyslania = procesyDoWyslania;
        $http({
            method: 'POST', 
            url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/dzialy',
            data: {
                "nazwaDzialu" : $scope.nazwaNowegoDzialu,
                "procesy" : $scope.procesyDoWyslania
            }
        }).success(function(response){
            $scope.hideModal();
            $scope.reRender();
        });
    }
	$http({
        method: 'GET',
        url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/dzialy'
    }).success(function(response){
		$scope.dzialy = response;
        console.log($scope.dzialy)
        
        for(var i = 0; i < $scope.dzialy.length; i++) {
            $scope.dzialy_ids_array.push($scope.dzialy[i].id);
        }
        for (var i = 0; i < $scope.dzialy_ids_array.length; i++) {
            $scope.customHTTPCall($scope.dzialy_ids_array, i, 'liczbaprocesow');
            $scope.customHTTPCall($scope.dzialy_ids_array, i, 'liczbapracownikow');
            $scope.customHTTPCall($scope.dzialy_ids_array, i, 'liczbastanowisk');
        }
    });
    $http({method: 'GET', url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/procesy'}).success(function(response){
        $scope.wszystkieProcesy = response;
    });

    

}]);