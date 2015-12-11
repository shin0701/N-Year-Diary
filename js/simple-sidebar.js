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
    
});