var competencesPage = {
    elements: {
        clearFLag: false,
        data: {},
        nodesIndex: 0,
        edgesIndex: 0,
        flagBack: false
    },
    // init
    init: function(){
        competencesPage.remapData(); // DO USUNIĘCIA, to będzie wykonywane po stronie serwera
        var html = competencesPage.showCompetences($scope.daneX); // generowanie listy kompetencji
        $(".competences-list").append(html);
        competencesPage.events();
    },
    // events
    events: function(){
        $("a.show-tree").on("click",function(){ // Kliknięcie 'pokaż drzewo' przy kompetencji
            var comId = $(this).attr("data-id"); // w data-id znajduje się id kompetencji
            competencesPage.cytoscapeInit(comId);
        });
         
        // Dodanie calkowicie nowej kompetencji
        // ZMIANA 1 ---\
        $('#addnewcompetencemodal a.addnewcompetence').on("click");
        $('#addnewcompetencemodal a.addnewcompetence').on("click", function(e){
            competencesPage.addNewCompetence();
        });
        // ZMIANA 1 ---/
         
        $('.collapsible').collapsible({ // ACORDION do listy kompetencji
            accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });  
    },
    // DO USUNIĘCIA - To będzie się wykonywało automatycznie po stronie serwera ---- Generowanie bazy danych
    // ------------\/
    remapData: function(){
        var newData = $scope.daneX;
        $.each($scope.daneX, function(index, val){
            val.bazoweId = [];
        });
        for(var i = 0; i < $scope.daneX.length; i++){
            var x = 0;
            for (var j = 0; j < $scope.daneX.length; j++){
                if ($.inArray($scope.daneX[i].id, $scope.daneX[j].rodzicId) > -1){
                    newData[i].bazoweId[x] = $scope.daneX[j].id;
                    x++;
                }
            }
        }
        $scope.daneX = newData;
    },
    // -------------/\
    // Generowanie listy kompetencji (html)
    showCompetences: function(obj){
        if(competencesPage.elements.clearFLag){
            $(".competences-list").empty();
        }
        var html = "";
        html += "<ul class='collapsible' data-collapsible='expandable'>";
        for(var i = 0; i < $scope.daneX.length; i++){
            // ZMIANA 1 ---\
            if (!$scope.daneX[i].rodzicId.length){ // && $scope.daneX[i].bazoweId.length
            // ZMIANA 1 ---/
                html += "<li>"
                    html += "<div class='edits'>";
                    html += "<a href='#show-tree' class='modal-trigger show-tree' data-id='" + $scope.daneX[i].id + "'>Pokaż drzewo</a>";
                    //html += "<a href='#editmodal' class='modal-trigger editmodal'>Edytuj</a>";
                    html += "</div>";
                    html += "<div class='collapsible-header'>";
                        html += $scope.daneX[i].nazwa;
                    html += "</div>";
                    html += "<div class='collapsible-body'>";
                        html += competencesPage.getChilds(i);
                    html += "</div>"
                html += "</li>";
            }
        }
        html += "</ul>";
        return html; 
    },
    // Generowanie dzieci dzieci dzieci dzieci do showCompetences^ (rekurencja)
    getChilds: function(index){
        var html = "";
        html += "<ul>";
        for (var i = 0; i < $scope.daneX[index].bazoweId.length; i++){ // going through childs
            $.each($scope.daneX,function(key, val){ // searching for n child element in data
                if(val.id === $scope.daneX[index].bazoweId[i]){
                    html += "<li><i class='material-icons'>play_arrow</i>" + val.nazwa;
                    if($scope.daneX[key].bazoweId.length){ // checking if child have childs..
                        html += competencesPage.getChilds(key);
                    }
                } 
            });
            html += "</li>";
        }
        html += "</ul>";
        return html;
    },
    // cytoscape init
    cytoscapeInit: function(id){
        var elements = { // Przygotowanie obiektu pod Cytoscape
            nodes: [],
            edges: []
        };
        // zerowanie zmiennych pomocnicznych
        competencesPage.elements.edgesIndex = 0;
        competencesPage.elements.nodesIndex = 0;
         
        competencesPage.cytoscapeGetDataById(id, elements);
    },
    // Tworzenie JSON'a Elements (do wygenerowania drzewa)
    cytoscapeGetDataById(id, elements){    
        var data = $scope.daneX;
        $.each(data, function(key, val){
            if(id == val.id){
                elements.nodes[competencesPage.elements.nodesIndex++] = {data: {id: val.id, label: val.nazwa}};
                for (var i = 0; i < val.bazoweId.length; i++){
                    $.each($scope.daneX, function(index, elem){
                        if(elem.id == val.bazoweId[i]){
                            elements.nodes[competencesPage.elements.nodesIndex++] = { data: { id: val.bazoweId[i], label: elem.nazwa } };
                        }
                    });
                    elements.edges[competencesPage.elements.edgesIndex++] = { data: { source: val.id, target: val.bazoweId[i] } };
                    elements = competencesPage.cytoscapeGetSubChildrens(elements, data, val.bazoweId[i]); // Pobieranie dzieci dzieci ..
                }
            }
        });
        competencesPage.cytoscapeCreate(elements, id);
    },
    // Generowanie dzieci dzieci dzieci dzieci do cytoscapeGetDataById^ (rekurencja)
    cytoscapeGetSubChildrens(elements, data, id){
        $.each(data, function(key, val){
            if(id == val.id){
                for (var i = 0; i < val.bazoweId.length; i++){
                    $.each($scope.daneX, function(index, elem){
                        if(elem.id == val.bazoweId[i]){
                            elements.nodes[competencesPage.elements.nodesIndex++] = { data: { id: val.bazoweId[i], label: elem.nazwa } };
                        }
                    });
                    elements.edges[competencesPage.elements.edgesIndex++] = { data: { source: val.id, target: val.bazoweId[i] } };
                    elements = competencesPage.cytoscapeGetSubChildrens(elements, data, val.bazoweId[i]);
                }       
            } 
        });
        return elements;
    },
    // Tworzenie obiektu cytoscape (drzewa)
    cytoscapeCreate: function(elements, id){
        if(competencesPage.elements.clearFLag){ // jeżeli clearFlag = true, wyczyść diva z drzewem
            $("#cy").empty();
        }
        competencesPage.elements.clearFLag = false;
         
        $('.modal-trigger').leanModal(); // otwarcie modala
        // Obiekt cytoscape
        var cy = cytoscape({
            container: document.getElementById('cy'),
 
            boxSelectionEnabled: false,
            autounselectify: true,
            // zoomingEnabled: false,
 
            layout: {
                name: 'dagre',
                animate: true
            },
 
            style: [
                {
                    selector: 'node',
                    style: {
                        'content': 'data(label)',
                        'text-opacity': 0.5,
                        'text-valign': 'center',
                        'text-halign': 'right',
                        'background-color': '#11479e'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 4,
                        'target-arrow-shape': 'triangle',
                        'line-color': '#9dbaea',
                        'target-arrow-color': '#9dbaea'
                    }
                },
                {
                  selector: '.top-left',
                  style: {
                    'text-valign': 'top',
                    'text-halign': 'left'
                  }
                },
            ],
            elements: elements, // Obiekt elements wygenerowany w cytoscapeInit
        });
         
        competencesPage.cytoscapeEvents(cy, id); // Eventy po wygenerowaniu drzewa
    },  
    cytoscapeEvents: function(cy, id){
 
        /*
            Naciśnięcie na kompetencje (node) - Dodawanie podkompetencji
        */
        cy.on('tap', 'node', { foo: 'bar' }, function(evt){
 
            var node = evt.cyTarget;
             
            var competencesList = []; // przygotowanie listy kompetencji do wyświetlenia w select'ie
            $.each($scope.daneX, function(index, val){ // przypisanie wszystkich kompetencji do competencesList
                competencesList[index] = val.id;
            });
             
            /*
                Wykluczanie rodziców (i rodziców rodziców rodziców..) i dziecko wybranej kompetecji (aby uniemożliwić dodanie jeszcze raz tego samego dziecka, lub rodzica/ów jako podkompetencje)
            */
            //-------\/
            $.each($scope.daneX, function(index, val){
                if ( val.id == node.id() ){
                    competencesList.splice(index, 1);
                    $.each(val.rodzicId, function(j, rodzic){
                        $.each(competencesList, function(i){
                            if ( competencesList[i] == rodzic ){
                                competencesList.splice(i, 1);
                            }
                        });
                        competencesList = competencesPage.competencesList(rodzic, competencesList); // Pomoc przy generowaniu rodziców rodziców....
                    });
                    $.each(val.bazoweId, function(j, dziecko){
                        $.each(competencesList, function(i){
                            if( competencesList[i] == dziecko){
                                competencesList.splice(i, 1);
                            } 
                        });
                    });
                }
            });
            //--------/\
             
            $("a[href='#addmodal']").trigger("click"); // otwórz modal dodawania podkompetencji
             
            // ZMIANA 1 ---\
            $("#competence-name").val(""); // Wyczyść input
            // ZMIANA 1 ---/
            $(".choose-competence").empty(); // wyczyść przed tworzeniem listy
             
            // Tworzenie selecta z listą możliwych do dodania kompetencji
            var html = "<select class='position-select'>";
            $.each(competencesList, function(i, val){
                html += "<option value='" + val + "'>";
                $.each($scope.daneX, function(i, value){
                    if(val == value.id){
                        html += value.nazwa;
                    }
                });
                html += "</option>";
            });
            html += "</select>";
            $(".choose-competence").append(html);
             
            $('select').material_select(); // przetworzenie selecta na materialize
             
            // Kliknięcie dodania kompetencji z listy (select)
            $("#addmodal .addcompetence").off("click");
            $("#addmodal .addcompetence").on("click", function(e){
                // pobranie wartości z selecta
                var childId = $('.choose-competence select').val();
                // Dodanie nowego id jako rodzica - TU ZMIANA NA WYSŁANIE DO SERWERA
                // -----\/
                $.each($scope.daneX, function(index, val){
                    if( val.id == childId ){
                        var nodeId = parseInt(node.id());
                        $scope.daneX[index].rodzicId.push(nodeId);
                    }
                });
                // -----/\
                 
                competencesPage.elements.clearFLag = true; // ustawienie flagi czyszczenia drzewa (bedzie wygenerowane nowe)
                competencesPage.init(); // inicjalizacja wszystkiego jeszcze raz (nowe wygenerowanie listy i drzewa)
                competencesPage.cytoscapeInit(id); // automatyczne ponowne otwarcie drzewa w którym nastąpiła edycja
                 
                $("#addmodal .close").trigger("click");
            });
             
            // Kliknięcie dodania kompetencji z inputa (wpisana nazwa)
            $("#addmodal .addnewcompetence").off("click");
            $("#addmodal .addnewcompetence").on("click", function(e){
                 
                // dodanie nowej kompetencji do danych - TU ZMIANA NA WYSŁANIE DO SERWERA
                // -----\/
                var index = $scope.daneX.length + 1;
                $scope.daneX.push(
                    {
                        id: index, 
                        nazwa: $("#competence-name").val(),
                        rodzicId: [parseInt(node.id())],
                        bazoweId: []
                    }
                );
                // -----/\
                // wywolanie funkcji ktora zapisuje nową kompetencje na serwerze oraz edytuje jej rodzica
                $scope.dodajKompetencje(parseInt(node.id()), $("#competence-name").val());
                 
                competencesPage.elements.clearFLag = true; // ustawienie flagi czyszczenia drzewa (bedzie wygenerowane nowe)
                competencesPage.init(); // inicjalizacja wszystkiego jeszcze raz (nowe wygenerowanie listy i drzewa)
                competencesPage.cytoscapeInit(id); // automatyczne ponowne otwarcie drzewa w którym nastąpiła edycja
                 
                $("#addmodal .close").trigger("click");
            });
             
        });
        /* 
            Naciśnięcie na krawedź miedzy kompetencjami - usuwanie relacji
        */
        cy.on('tap', 'edge', { foo: 'bar' }, function(evt){
             
            var edge = evt.cyTarget;
             
            $("a[href='#alert']").trigger("click"); // Pokaż modal z potwierdzeniem usunięcia
             
            $("#alert .accept").off("click");
            $("#alert .accept").on("click", function(e){ // Po kliknięciu akceptuj ponowna inicjalizacja
                // Usuwanie id kompetencji rodzica - TU ZMIANA NA WYSYŁANIE DO SERWERA
                // ----\/
                $.each($scope.daneX, function(index, val){
                    if ( val.id == edge.target()._private.data.id ){
                        var elemIndex = 0;
                        $.each($scope.daneX[index].rodzicId, function(index, val){
                            if ( val == edge.source()._private.data.id ){
                                elemIndex = index;
                            }
                        });
                        $scope.daneX[index].rodzicId.splice(elemIndex, 1);
                    }
                });
                // ----/\

                // wywolanie funkcji ktora wysyla dane do serwera
                $scope.usunRelacje(edge.source()._private.data.id, edge.target()._private.data.id);
                 
                competencesPage.elements.clearFLag = true; // ustawienie flagi czyszczenia drzewa (bedzie wygenerowane nowe)
                competencesPage.init(); // inicjalizacja wszystkiego jeszcze raz (nowe wygenerowanie listy i drzewa)
                competencesPage.cytoscapeInit(id); // automatyczne ponowne otwarcie drzewa w którym nastąpiła edycja 
                 
                $("#alert a.close").trigger("click");
            });
        });
    },
    // Usuwanie rodziców rodziców rodziców z listy możliwych do dodania kompetencji (rekurencja) - pomocniczna dla cytoscapeEvents
    competencesList: function(nodeId, competencesList){
        $.each($scope.daneX, function(index, val){
            if(val.id == nodeId){
                $.each(val.rodzicId, function(j, rodzic){
                    $.each(competencesList, function(i){
                        if ( competencesList[i] == rodzic ){
                            competencesList.splice(i, 1);
                        }
                    });
                    competencesList = competencesPage.competencesList(rodzic, competencesList);
                });
            }
        });
        return competencesList;
    },
    // ZMIANA 1 ---\
    // Dodawanie calkowicie nowe kompetencji do bazy
    addNewCompetence: function(){
        var index = $scope.daneX.length + 1;
        $scope.daneX.push(
            {
                id: index, 
                nazwa: $("#new-competence-name").val(),
                rodzicId: [],
                bazoweId: []
            }
        );
        $("#new-competence-name").val(""); // Wyczyść inputa po dodaniu
        $(".competences-list").empty(); // Wyczyść liste kompetencji przed ponowną inicjalizacją
        competencesPage.init();
    }
    // ZMIANA 1 ---/
};
     
