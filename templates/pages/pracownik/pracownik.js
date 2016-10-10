angular.module('MortApp.pracownik', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/pracownik/:id', {
    templateUrl: 'templates/pages/pracownik/pracownik.html',
    controller: 'pracownikCtrl'
  });
}])

.controller('pracownikCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
    $scope.editMode = false;
    $scope.toggleEditMode = function() {
        if($scope.editMode === false) {
            $scope.editMode = true;
        }else {
            $scope.editMode = false;
        }
    };
    $scope.pobierzWszystkieKompetencje = function(){
        $http({
            method: 'GET',
            url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/kompetencje'
        }).success(function(response){
            $scope.wszystkieKompetencje = response;
        });
    };

    $scope.dodajPracownikowiKompetencje = function(){
        console.log($scope.nowaKompetencjaPracownika);
        console.log($scope.ocenaNowejKompetencji);
        $http({
            method: 'POST',
            url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/silykompetencji',
            data:{
                    "archiwum": false,
                    "kompetencja": {
                      "id": $scope.nowaKompetencjaPracownika
                    },
                    "pracownik": {
                      "id": $routeParams.id 
                    },
                    "silaKompetencji": $scope.ocenaNowejKompetencji
                }
        }).success(function(response){
           console.log($scope.nowaKompetencjaPracownika);
           console.log($scope.ocenaNowejKompetencji);
        });
    };






        


	$http({
		method: 'GET',
		url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/pracownicy/' + $routeParams.id 
	}).success(function(response){
		$scope.pracownik = response;
        /*
        var dzialyPracownika = []
        var nazwyDzialowPracownika = []
        for(var i = 0; i < $scope.pracownik.dzialy.length; i++){
            dzialyPracownika.push($scope.pracownik.dzialy[i].id)
            $http({
                method: 'GET',
                url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/dzialy/' + $scope.pracownik.dzialy[i].id
            }).success(function(response){
                nazwyDzialowPracownika.push(response.nazwaDzialu)
                console.log(response) 
            }); 
        } 
        */
	});
    $http({
        method: 'GET',
        url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/pracownicy/' + $routeParams.id + '/silykompetencji'
    }).success(function(response){
        $scope.kompetencje = response;
    });
    $http({
        method: 'GET',
        url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/pracownicy/' + $routeParams.id + '/dzialy'
    }).success(function(response){
        $scope.dzialyPracownika = response;
    }); 
    $scope.usunPracownika =function(){
        $http({
            method: 'DELETE',
            url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/pracownicy/' + $routeParams.id
        }).success(function(response){
            console.log(response);
        });
    }
}]);