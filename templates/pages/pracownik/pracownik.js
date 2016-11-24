angular.module('MortApp.pracownik', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/pracownik/:id', {
    templateUrl: 'templates/pages/pracownik/pracownik.html',
    controller: 'pracownikCtrl'
  });
}])

.controller('pracownikCtrl', ['$scope', '$http', '$routeParams', '$route', function($scope, $http, $routeParams, $route) {
    $scope.czyBrakKompetencji = false;
    $scope.editMode = false;

    $scope.toggleEditMode = function() {
        if($scope.editMode === false) {
            $scope.editMode = true;
        }else {
            $scope.editMode = false;
        }
    };

    // funkcja która re-renderuje całą stronę
    $scope.reRender = function(){
        $route.reload();
    };
    $scope.hideModal = function(modalID){
        $(modalID).closeModal();
    };

    $scope.GET_wszystkieKompetencje = function(){
        $http({
            method: 'GET',
            url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/kompetencje'
        }).success(function(response){
            $scope.wszystkieKompetencje = response;

            // zapisuję id'ki wszystkich kompetencji danego pracownika do jednej listy
            var idKompetencjiPracownika = []
            for (var i = 0; i < $scope.kompetencje.length; i++){
                idKompetencjiPracownika.push($scope.kompetencje[i].kompetencja.id);
            }

            $scope.dostepneKompetencje = [];
            for (var i = 0; i < $scope.wszystkieKompetencje.length; i++){
                if (idKompetencjiPracownika.indexOf($scope.wszystkieKompetencje[i].id) == -1){
                    $scope.dostepneKompetencje.push($scope.wszystkieKompetencje[i]);
                }
            }
        });
    };

    $scope.GET_dane_pracownika = function(){
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
    };

    $scope.GET_kompetencjePracownika = function(callback){
        $http({
            method: 'GET',
            url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/pracownicy/' + $routeParams.id + '/silykompetencji'
        }).success(function(response){
            $scope.kompetencje = response;
            if(response.length == 0){
                $scope.czyBrakKompetencji = true;
            }
            callback();
        });
    };

    $scope.GET_dzialyPracownika = function(){
        $http({
            method: 'GET',
            url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/pracownicy/' + $routeParams.id + '/dzialy'
        }).success(function(response){
            $scope.dzialyPracownika = response;
        }); 
    };

    $scope.dodajPracownikowiKompetencje = function(){
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
            $scope.hideModal('#addworkercompetence');
            $scope.reRender();
        });
    };

    $scope.usunPracownika =function(){
        $http({
            method: 'DELETE',
            url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/pracownicy/' + $routeParams.id
        }).success(function(response){
            console.log(response);
        });
    };

    $scope.GET_dane_pracownika();
    $scope.GET_dzialyPracownika();
    $scope.GET_kompetencjePracownika($scope.GET_wszystkieKompetencje);

}]);