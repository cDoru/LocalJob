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
//rende le info cliccabili e aggiorna il menu a tendina al click
function infoCliccabile(){
	$(".infoClick").click(function(){
        alert("che ci mettiamo?");
    });
	$(".giorno").click(function(){
        giorno = $(this).text();
		$("#proDay").html(giorno+" <span class='caret'></span>");
    });
	$(".mese").click(function(){
        mese = $(this).text();
		$("#proMonth").html(mese+" <span class='caret'></span>");
    });
}

//funzione per gestire aggiunta professione in signin_pro_professional.html
function qualeAttivita(){

	switch(contaAttivita){
		case 0:	//mostra tendina
				//$("#lista").append("<input id='professione1' class='form-control input-lg' type='text' placeholder='Prima professione'/>");
				
				$("#lista").append("<div class='btn-group professioni'>"+
										"<button type='button' class='btn btn-default dropdown-toggle btn-lg' data-toggle='dropdown'>"+
											"Prima professione <span class='caret'></span>"+
										"</button>"+
										"<ul class='dropdown-menu' role='menu'></ul>"+
									"</div>");
		break;
		case 1:	//mostra tendina
				$("#lista").append("<div class='btn-group'>"+
										"<button type='button' class='btn btn-default dropdown-toggle btn-lg' data-toggle='dropdown'>"+
											"Seconda professione <span class='caret'></span>"+
										"</button>"+
										"<ul class='dropdown-menu' role='menu'></ul>"+
									"</div>");
		break;
		case 2:	//mostra tendina
				$("#lista").append("<div class='btn-group'>"+
										"<button type='button' class='btn btn-default dropdown-toggle btn-lg' data-toggle='dropdown'>"+
											"Terza professione <span class='caret'></span>"+
										"</button>"+
										"<ul class='dropdown-menu' role='menu'></ul>"+
									"</div>");
		break;
	}
	//modifica pulsante
	$("#aggiungi").html("Aggiungi");
	$("#aggiungi").attr("onclick", "inserisciAttivita();");
	
	//incrementa semaforo
	contaAttivita = contaAttivita+1;
}
function inserisciAttivita(){
	switch(contaAttivita){
		case 1:	$("#aggiungi").attr("onclick", "qualeAttivita()");
				$("#aggiungi").html("<span class='glyphicon glyphicon-plus'></span> Aggiungi professione");
		
		break;
		case 2:	$("#aggiungi").attr("onclick", "qualeAttivita();");
				$("#aggiungi").html("<span class='glyphicon glyphicon-plus'></span> Aggiungi professione");
		
		break;
		case 3:	$('#aggiungi').hide();
				$('.form-consumer').append('<button class="btn btn-lg btn-block btn-default" type="submit">Conferma</button>');
		break;
	}
}


function completeMenu(){
	completeDay();
	completeMonth();
}
function completeDay(){
	$("#dayList").html("");
	for ( var i = 1; i < 32; i++ ){
		$("#dayList").append("<li class='giorno'>"+i+"</li>");
	}
}
function completeMonth(){
	$("#monthList").html("<li class='mese'>Gen</li>");
	$("#monthList").append("<li class='mese'>Feb</li>");
	$("#monthList").append("<li class='mese'>Mar</li>");
	$("#monthList").append("<li class='mese'>Apr</li>");
	$("#monthList").append("<li class='mese'>Mag</li>");
	$("#monthList").append("<li class='mese'>Giu</li>");
	$("#monthList").append("<li class='mese'>Lug</li>");
	$("#monthList").append("<li class='mese'>Ago</li>");
	$("#monthList").append("<li class='mese'>Set</li>");
	$("#monthList").append("<li class='mese'>Ott</li>");
	$("#monthList").append("<li class='mese'>Nov</li>");
	$("#monthList").append("<li class='mese'>Dic</li>");
}
function refreshMonth(){
	
}