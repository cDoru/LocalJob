var occasionaleCheck = false;
var contaAttivita = 0;
var professioneInserita;

$(document).ready(function(){
	//se occasionale è checkato, disabilita campo partita iva
	$("#occasionale").click(function() {
		if(occasionaleCheck){
			$("#proPIVA").prop("disabled", false);
			$("#proRS").attr("placeholder", "Ragione sociale");
			occasionaleCheck = false;
		}
		else{
			$("#proPIVA").prop("disabled", true);
			$("#proRS").attr("placeholder", "Nome attività");
			occasionaleCheck = true;
		}	
	});
	
});

//rende jumbotron cliccabile in signin_role.html
function cliccabile(){
	$(".role_name").click(function(){
        window.location=$(this).find("a").attr("href");
        return false;
    });
}

//funzione per gestire aggiunta professione in signin_pro_professional.html
function qualeAttivita(){

	switch(contaAttivita){
		case 0:	//mostra input
				$("#lista").append("<input id='professione1' type='text' class='form-control' placeholder='Digita prima professione'/>");
		break;
		case 1:	//mostra input
				$("#lista").append("<input id='professione2' type='text' class='form-control' placeholder='Digita seconda professione'/>");
		break;
		case 2:	//mostra input
				$("#lista").append("<input id='professione3' type='text' class='form-control' placeholder='Digita ultima professione'/>");
		break;
	}
	//modifica pulsante
	$("#aggiungi").html("Aggiungi");
	$("#aggiungi").attr("href", "javascript:inserisciAttivita();");
	
	//incrementa semaforo
	contaAttivita = contaAttivita+1;
	
}
function inserisciAttivita(){
	switch(contaAttivita){
		case 1:	$('#professione1').attr('disabled','disabled');
				professione1 = $("#professione1").val();
				$("#aggiungi").attr("href", "javascript:qualeAttivita();");
				$("#aggiungi").html("<span class='glyphicon glyphicon-plus'></span> Aggiungi professione");
		
		break;
		case 2:	$('#professione2').attr('disabled','disabled');
				professione2 = $("#professione2").val();
				$("#aggiungi").attr("href", "javascript:qualeAttivita();");
				$("#aggiungi").html("<span class='glyphicon glyphicon-plus'></span> Aggiungi professione");
		
		break;
		case 3:	$('#professione3').attr('disabled','disabled');
				professione3 = $("#professione3").val();
				$('#aggiungi').hide();
				$('.form-consumer').append('<button class="btn btn-lg btn-block btn-default" type="submit">Conferma</button>');
		break;
	}
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