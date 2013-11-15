function cliccabile(){
	$(".role_name").click(function(){
                 window.location=$(this).find("a").attr("href");
                 return false;
                });
}