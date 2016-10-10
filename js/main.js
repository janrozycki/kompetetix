$(document).ready(function(){
    // Smooth fade in on site load
    $(".row").fadeIn(500);   
    
    // Left menu slide
    $(".menu-left").on({
        mouseenter: function(){
            $(this).css("width","15em");
            $(".menu-text").removeClass("hidden").slideDown();
        },
        mouseleave: function(){
            $(this).css("width","4em");
        }
    });
    
    // Process page
    if($("#process").length){
        // Show/Hide workers list after select change
        $(".position-select").on("change",function(){
           if($(this).val() !== ""){
               $(".workers-list").removeClass("hidden");
           }else{
               $(".workers-list").addClass("hidden");
           }
        });
        // Select style and copy value when selected
        $(".workers-list li a").on("click", function(e){
            e.preventDefault();
            $(".workers-list li").removeClass("selected");
            $(this).closest("li").addClass("selected");
            var workerId = $(this).attr("data-worker-val");    
            $("input#worker").val(workerId);
            
            $(".worker-competences").fadeOut().fadeIn();
        });
        // Remove disable from comptence after choosing position
        $("#add-position select.choose-position").on("change",function(){
            if($(this).val() !== ""){
                $("#add-position select.choose-competence").removeAttr("disabled");
                $('select').material_select();
            } 
        });
        // Todo
        $("#add-position .position-select").on("click",function(){
            if($("#add-position select.choose-position").attr("disabled")){
                $("#add-position select.choose-position").removeAttr("disabled");
                $('select').material_select();
            }
        });
        // Todo
        $("#add-position .new-position").on("click",function(){
            if($(this).attr("disabled")){
                $(this).removeAttr("disabled");
//                $('select').material_select();
            }
        });
    }
//    if($("#departments").length){
        Ladda.bind( 'button.ladda-button', { timeout: 2000 } );
//    }
//    $("button.ladda-button").on("click",function(e){
//        e.preventDefault();
//        $( 'button.ladda-button' ).ladda( 'bind' );
//        var l = $(this).ladda();
//        l.ladda('start');
//        setTimeout(function(){
//            
//        },2000);
//        l.stop();
//    });
//    
    // Material design settings
    $('.modal-trigger').leanModal();
    $('select').material_select();
});