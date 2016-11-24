angular.module('MortApp.dzial', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dzial/:id', {
    templateUrl: 'templates/pages/dzial/dzial.html',
    controller: 'dzialCtrl'
  });
}])

.controller('dzialCtrl', ['$scope', '$http', '$routeParams', '$route', function($scope, $http, $routeParams, $route) {

    $scope.inputLimit = true;
    $scope.inputCounter = 1;

    $scope.reRender = function(){
        $route.reload();
    };
    $scope.hideModal = function(){
        $('#add-process').closeModal();
    };

    $scope.dodajKolejnyProces = function(){ 
        var inputNumber = $scope.inputCounter + 1;
        $('#noweProcesyForm').append("<div class='input-field col s10'><input ng-model='nowyProces_" + inputNumber + "' class='section-name' type='text' class='validate'><label for='first_name'> Nazwa procesu</label></div>");
        if ($scope.inputCounter == 2){
            $scope.inputLimit = false;
        }
        $scope.inputCounter++;
    };

    $scope.dodajProcesDoDzialu = function(){
        // jak dodać kilka procesów na raz????
        // for (var i = 0; i < $scope.inputCounter; i++){
        //     if 
        // }
        $http({
            method: 'POST', 
            url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/procesy',
            data: {
                "nazwaProcesu" : $scope.nowyProces_1
            }
        }).success(function(response){
            var idNowegoProcesu = parseInt(response);
            var liczbaProcesowWDziale = $scope.dzial.procesy.length;
            var nazwaDzialu = $scope.dzial.nazwaDzialu;
            var IdprocesowWDziale = [];
            if(liczbaProcesowWDziale > 0){
                for (var i = 0; i < liczbaProcesowWDziale; i++){
                    IdprocesowWDziale.push({"id": $scope.dzial.procesy[i].id})
                }
            }
            IdprocesowWDziale.push({"id": idNowegoProcesu});

            $http({
                method: 'PUT', 
                url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/dzialy/' + $routeParams.id,
                data: {
                    "id": $routeParams.id,
                    "nazwaDzialu": nazwaDzialu,
                    "procesy": IdprocesowWDziale
                }
            }).success(function(response){
                $scope.hideModal();
                $scope.reRender();
                console.log("nowy kod2 dziala")
            });

        });
    }

    $http({
        method: 'GET',
        url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/dzialy/' + $routeParams.id
    }).success(function(response){
        $scope.dzial = response;
    });
	$http({
		method: 'GET',
		url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/dzialy/' + $routeParams.id + '/procesy' 
	}).success(function(response){
		$scope.procesy = response;
        for (var i = 0; i < $scope.procesy.length; i++) {
            $scope.counter1 = 0;
            $http({
                method: 'GET',
                url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/procesy/' + $scope.procesy[i].id + '/stanowiska'
            }).success(function(response){
                $scope.procesy[$scope.counter1].liczbaStanowisk = response.length;
                $scope.counter1++;
            });

        }
	});
	
}]);