var occasionaleCheck = false;
var contaAttivita = 0;

$(document).ready(function(){
	//se occasionale è checkato, disabilita campo partita iva
	$("#occasionale").click(function() {
		if(occasionaleCheck){
			$("#partIva").prop("disabled", false);
			$("#ragSoc").attr("placeholder", "Ragione sociale");
			occasionaleCheck = false;
		}
		else{
			$("#partIva").prop("disabled", true);
			$("#ragSoc").attr("placeholder", "Nome attività");
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
		$('#infoDati').modal();
    });
	$(".giorno").click(function(){		//classe del .li
        giorno = $(this).text();
		$("#day").html(giorno+" <span class='caret'></span>");	//bottone del menu a tendina
    });
	$(".mese").click(function(){
        mese = $(this).text();
		$("#month").html(mese+" <span class='caret'></span>");
    });
	//menu professioni
	$(".prima").click(function(){
        attivita = $(this).text();
		$("#pulsanteProf1").html(attivita+" <span class='caret'></span>");
    });
	$(".seconda").click(function(){
        attivita = $(this).text();
		$("#pulsanteProf2").html(attivita+" <span class='caret'></span>");
    });
	$(".terza").click(function(){
        attivita = $(this).text();
		$("#pulsanteProf3").html(attivita+" <span class='caret'></span>");
    });
}

//funzione per gestire aggiunta professione in signin_pro_professional.html
function nuovaAttivita(){

	if(contaAttivita == 0){
		
		//mostra menu professione 1
		$("#prof1").fadeIn();
							
		//incrementa semaforo
		contaAttivita = contaAttivita+1;
	}
	else if(contaAttivita == 1){
		
		//mostra menu professione 1
		$("#prof2").fadeIn();
		
		//incrementa semaforo
		contaAttivita = contaAttivita+1;
	}
	else if(contaAttivita == 2){
		
		//mostra menu professione 1
		$("#prof3").fadeIn();		
		
		//incrementa semaforo
		contaAttivita = contaAttivita+1;
		
		//modifica pulsante
		$("#aggiungi").attr("onclick", "window.location='signin_pro_place.html'");
		$("#aggiungi").attr("class", "btn btn-lg btn-block btn-primary");
		$("#aggiungi").html("Continua");
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

function getDatiPro(){
	numeroCel = $('#cel').val();
	sessionStorage.numeroCel = numeroCel;
	window.location='signin_pro_professional.html';
}
function checkCel(){
	$("#tel").attr("value", sessionStorage.numeroCel);
}