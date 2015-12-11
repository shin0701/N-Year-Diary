$(window).load(function(){
    
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
        
        if($("#toggle").attr("class")=="glyphicon glyphicon-chevron-left"){
            $("#toggle").attr("class", "glyphicon glyphicon-chevron-right");
        }
        else{
            $("#toggle").attr("class", "glyphicon glyphicon-chevron-left");
        }
    });
    
    $( "#sidebar-wrapper" ).scroll(function() {
        $( "#LANGUAGE_LIST" ).css( {top: $("#sidebar-wrapper").height()+$("#sidebar-wrapper").scrollTop()-36} );
    });
});
