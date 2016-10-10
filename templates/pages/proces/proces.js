angular.module('MortApp.proces', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dzial/:idDzialu/proces/:idProcesu', {
    templateUrl: 'templates/pages/proces/proces.html',
    controller: 'procesCtrl'
  });
}])

.controller('procesCtrl', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {

	$scope.zaokraglijOcene = function(ocena){
		return Math.round(ocena * 4);
	};
	// sortowanie tablicy obiektow na podstawie klucza
	$scope.sortByKey = function(array, key) {
	    return array.sort(function(a, b) {
	        var x = a[key]; var y = b[key];
	        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	    });
	};
	$scope.przydzielOceneDoStanowiska = function(stanowiska){
		for(var i = 0; i<stanowiska.length; i++){

		}
	};

	$scope.pobierzMacierz = function(idKompetecjiStanArr){
		//wszyscy pracownicy danego procesu
		$http({
			method: 'GET',
			url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/dzialy/' + $routeParams.idDzialu + '/silykompetencji'
			// url: 'static_resources/silyKompetencji.json'
		}).success(function(response){
			$scope.ocenyPracownikowDzialu = response;
			$scope.idPracownikowDzialu = [];
			$scope.pracownicyWDziale = {};

			for(var i = 0; i < $scope.ocenyPracownikowDzialu.length; i++) {

				// sprawdzam czy dana kompetencja jest kompetencją stanowiskową dla któregoś ze stanowisk w tym procesie
				if(idKompetecjiStanArr.indexOf($scope.ocenyPracownikowDzialu[i].kompetencja.id) > -1){

					// jeśli jest kompetencją stanowiskową
					var IDpracownika = $scope.ocenyPracownikowDzialu[i].pracownik.id;
					var imie_nazwisko = $scope.ocenyPracownikowDzialu[i].pracownik.imie + " " + $scope.ocenyPracownikowDzialu[i].pracownik.nazwisko;
					var indexPracownikaWTablicy = $scope.idPracownikowDzialu.indexOf(IDpracownika);
					var indexWProcesie;

					// sprawdzam czy pracownik zostal juz wczesniej dodany do tablicy
					if(indexPracownikaWTablicy < 0) {
						// jeśli nie został dodany:
						// dodaje jego id do pomocniczej tablicy zawierającej wartosci id dotychczas dodanych pracownikow
						// oraz zapisuje imie_nazwisko i przygotowuję pustą tablicę do wypełnienia ocenami kompetencji 
						$scope.idPracownikowDzialu.push(IDpracownika);
						$scope.pracownicyWDziale[IDpracownika] = {
							imieNazwisko : imie_nazwisko,
							kompetencje : []
						};
						// tworzę tablicę z zerami dla oceny kazdej kompetencji stanowiskowej w procesie
						for(var j = 0; j < idKompetecjiStanArr.length; j++){
							$scope.pracownicyWDziale[IDpracownika].kompetencje.push({
								kompetencja: {id: idKompetecjiStanArr[j]},
								silaKompetencji : 0
							});
						}
						indexWProcesie = idKompetecjiStanArr.indexOf($scope.ocenyPracownikowDzialu[i].kompetencja.id);
						if (indexWProcesie !== -1) {
						    $scope.pracownicyWDziale[IDpracownika].kompetencje[indexWProcesie] = {
						    	kompetencja: $scope.ocenyPracownikowDzialu[i].kompetencja,
								silaKompetencji: $scope.ocenyPracownikowDzialu[i].silaKompetencji
						    };
						} else {
							console.log("Błąd przy dodawaniu oceny pracownika do macierzy procesu")
						}
						
					}else {
						// jeśli pracownik został juz wcześniej dodany:
						// znajduje index na ktorym kompetencja powinna być zapisana i zapisuje ją pod tym indexem
						indexWProcesie = idKompetecjiStanArr.indexOf($scope.ocenyPracownikowDzialu[i].kompetencja.id);
						if (indexWProcesie !== -1) {
						    $scope.pracownicyWDziale[IDpracownika].kompetencje[indexWProcesie] = {
						    	kompetencja: $scope.ocenyPracownikowDzialu[i].kompetencja,
								silaKompetencji: $scope.ocenyPracownikowDzialu[i].silaKompetencji
						    };
						} else {
							console.log("Błąd przy dodawaniu oceny pracownika do macierzy procesu")
						}
					}
				}
			}
		});
	};

	// wszystkie stanowiska danego procesu
	$http({
		method: 'GET',
		url: 'http://glassfish.zecer.wi.zut.edu.pl/WebApplication20/dane/procesy/' + $routeParams.idProcesu + '/stanowiska'
		//url: 'static_resources/stanowiska.json'
	}).success(function(response){
		$scope.stanowiska = response;
		$scope.idKompetencjiStan = [];
		for(var i = 0; i < $scope.stanowiska.length; i++){
			$scope.idKompetencjiStan.push($scope.stanowiska[i].kompetencja.id);
		}
		$scope.pobierzMacierz($scope.idKompetencjiStan);
	});
	/*
	//dzial
	$http({
		method: 'GET',
		url: 'static_resources/dzialy/'+ $routeParams.idDzialu +'/dzial.json'
	}).success(function(response){
		$scope.dzial = response[0];
	});
	*/

	/*
	//proces
	$http({
		method: 'GET',
		url: 'static_resources/dzialy/'+ $routeParams.idDzialu +'/procesy/'+ $routeParams.idProcesu +'/proces.json'
	}).success(function(response){
		$scope.proces = response[0];
	});
	*/

	/*
	// ZMIANA 2 --- \/
    $('select').material_select();
    $(".overlay span").mouseover(function(){
        $(this).hide();
        $(this).next("a").show();
    });
    $(".overlay a").mouseleave(function(){
        $(this).hide();
        $(this).prev("span").show();
    });
    // ZMIANA 2 --- /\
    */
	
}]);