function cliccabile(){
	$(".role_name").click(function(){
        window.location=$(this).find("a").attr("href");
        return false;
    });
}
/*function completeMenu(){
	//completeDay();
	competeMonth();
}*/
/*function completeDay(){
	$("#dayList").html("<li><a href='#'>blablabla</a></li>");
}*/
function completeMonth(){
	$("#monthList").html("<li><a href='#'>Gen</a></li>");
	$("#monthList").append("<li><a href='#'>Feb</a></li>");
	$("#monthList").append("<li><a href='#'>Mar</a></li>");
	$("#monthList").append("<li><a href='#'>Apr</a></li>");
	$("#monthList").append("<li><a href='#'>Mag</a></li>");
	$("#monthList").append("<li><a href='#'>Giu</a></li>");
	$("#monthList").append("<li><a href='#'>Lug</a></li>");
	$("#monthList").append("<li><a href='#'>Ago</a></li>");
	$("#monthList").append("<li><a href='#'>Set</a></li>");
	$("#monthList").append("<li><a href='#'>Ott</a></li>");
	$("#monthList").append("<li><a href='#'>Nov</a></li>");
	$("#monthList").append("<li><a href='#'>Dic</a></li>");
}