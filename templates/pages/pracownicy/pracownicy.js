'use strict';

angular.module('MortApp.pracownicy', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/pracownicy', {
    templateUrl: 'templates/pages/pracownicy/pracownicy.html',
    controller: 'pracownicyCtrl'
  });
}])

.controller('pracownicyCtrl', ['$scope', '$http', '$route', function($scope, $http, $route) {
    $scope.hideModal = function(){
        $('#addWorker').closeModal();
    };

    // funkcja która re-renderuje całą stronę
    $scope.reRender = function(){
        $route.reload();
    };
    $scope.GET_wszyscyPracownicy = function(){
        $http({method: 'GET', url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/pracownicy'}).success(function(response){
            $scope.pracownicy = response;
        });
    };
       
    $scope.dodajPracownika = function(){
        var dzialyDoWyslania = []
        for (var i = 0; i < $scope.dzialyNowegoPracownika.length; i++) {
            dzialyDoWyslania.push({"id": $scope.dzialyNowegoPracownika[i]})
        }
        $scope.dzialyDoWyslania = dzialyDoWyslania;
        $http({
            method: 'POST',
            url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/pracownicy',
            data: {
                "dzialy" : $scope.dzialyDoWyslania,
                "imie" : $scope.imieNowegoPracownika,
                "nazwisko" : $scope.nazwiskoNowegoPracownika 
            }
        }).success(function(response){
            $scope.hideModal();
            $scope.reRender();
        });
    };

    $scope.GET_wszyscyPracownicy();
	
    $http({method: 'GET', url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/dzialy'}).success(function(response){
        $scope.wszystkieDzialy = response;
    });
    $scope.dzialyNowegoPracownika = []

    
}]);