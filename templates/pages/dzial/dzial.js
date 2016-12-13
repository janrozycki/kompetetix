angular.module('MortApp.dzial', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dzial/:id', {
    templateUrl: 'templates/pages/dzial/dzial.html',
    controller: 'dzialCtrl'
  });
}])

.controller('dzialCtrl', ['$scope', '$http', '$routeParams', '$route', function($scope, $http, $routeParams, $route) {

    $scope.reRender = function(){
        $route.reload();
    };
    $scope.hideModal = function(){
        $('#add-process').closeModal();
    };

    $scope.POST_procesDoDzialu = function(idNowegoProcesu){
        $http({
            method: 'POST', 
            url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/dzialy/' + $routeParams.id + '/proces',
            data: {
                "id": idNowegoProcesu
            }
        }).success(function(response){
            $scope.hideModal();
            $scope.reRender();
        });
    };

    $scope.generujDostepneProcesy = function(){
        $http({
            method: 'GET',
            url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/procesy/'
        }).success(function(response){
            $scope.wszystkieProcesy = response;
            $scope.procesyWDziale = $scope.procesy;
            $scope.dostepneProcesy = [];

            $scope.idProcesowWDziale = [];
            for (var i = 0; i < $scope.procesyWDziale.length; i++){
                $scope.idProcesowWDziale.push($scope.procesyWDziale[i].id);
            }

            for (var i = 0; i < $scope.wszystkieProcesy.length; i++){
                if ($scope.idProcesowWDziale.indexOf($scope.wszystkieProcesy[i].id) === -1 ){
                    $scope.dostepneProcesy.push($scope.wszystkieProcesy[i]);
                }
            }
        });
    };

    $scope.dodajNowyProcesDoDzialu = function(){
        $http({
            method: 'POST', 
            url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/procesy',
            data: {
                "nazwaProcesu" : $scope.nazwaNowegoProcesu
            }
        }).success(function(response){
            $scope.POST_procesDoDzialu(parseInt(response));
        });
    };

    $scope.dodajIstaniejacyProcesDoDzialu = function(){
        $scope.POST_procesDoDzialu(parseInt($scope.nowyProcesWDziale));
    };

    $scope.dodajProcesDoDzialu = function(){
        if($('#add-new-process-to-department').hasClass("active")){
            // użytkownik wybrał opcję dodania nowego procesu do działu
            if ($scope.nazwaNowegoProcesu == undefined){
                console.log("Nie podano nazwy działu")
            }else{
                $scope.dodajNowyProcesDoDzialu();
            }

        }else if($('#add-existing-process-to-department').hasClass("active")){
            // użytkownik wybrał opcję dodanie istaniejącego procesu do działu
            if ($scope.nowyProcesWDziale == undefined){
                console.log("Nie wybrano działu");
            }else{
                $scope.dodajIstaniejacyProcesDoDzialu();
            }

        }else{
            console.log("You didn't specify any new process")
        }
    };

    $scope.pobierzProcesyWDziale = function(){
        $http({
            method: 'GET',
            url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/dzialy/' + $routeParams.id
        }).success(function(response){
            $scope.dzial = response;
            $scope.procesy = response.procesy;

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

            $scope.generujDostepneProcesy();

        });
    };

    // $scope.dodajProcesDoDzialu = function(){
    //     // jak dodać kilka procesów na raz????
    //     // for (var i = 0; i < $scope.inputCounter; i++){
    //     //     if 
    //     // }
    //     $http({
    //         method: 'POST', 
    //         url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/procesy',
    //         data: {
    //             "nazwaProcesu" : $scope.nowyProces_1
    //         }
    //     }).success(function(response){
    //         var idNowegoProcesu = parseInt(response);
    //         var liczbaProcesowWDziale = $scope.dzial.procesy.length;
    //         var nazwaDzialu = $scope.dzial.nazwaDzialu;
    //         var IdprocesowWDziale = [];
    //         if (liczbaProcesowWDziale > 0){
    //             for (var i = 0; i < liczbaProcesowWDziale; i++){
    //                 IdprocesowWDziale.push({"id": $scope.dzial.procesy[i].id})
    //             }
    //         }
    //         IdprocesowWDziale.push({"id": idNowegoProcesu});

    //         $http({
    //             method: 'PUT', 
    //             url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/dzialy/' + $routeParams.id + '/proces',
    //             data: {
    //                 "id": idNowegoProcesu
    //                 // "nazwaDzialu": nazwaDzialu,
    //                 // "procesy": IdprocesowWDziale
    //             }
    //         }).success(function(response){
    //             $scope.hideModal();
    //             $scope.reRender();
    //         });

    //     });
    // };

    // ========================================================================
    // Funkcje wywołujące się automatycznie po załadowaniu strony:

    $scope.pobierzProcesyWDziale();
	
}]);