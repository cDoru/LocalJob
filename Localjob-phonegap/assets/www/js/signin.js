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
		case 0:	//mostra input
				/*$("#lista").append("<div class='input-group'>"+
									"<input id='professione1' class='form-control input-lg' type='text' placeholder='Digita prima professione'/>"+
									"<span class='input-group-addon infoClick input-lg'><span class='glyphicon glyphicon-info-sign'></span></span>"+
									"</div>");*/
				$("#lista").append("<input id='professione1' class='form-control input-lg' type='text' placeholder='Digita prima professione'/>");
		break;
		case 1:	//mostra input
				$("#lista").append("<input id='professione2' class='form-control input-lg' type='text' placeholder='Digita seconda professione'/>");
		break;
		case 2:	//mostra input
				$("#lista").append("<input id='professione3' class='form-control input-lg' type='text' placeholder='Digita ultima professione'/>");
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
		case 1:	$("#professione1").attr("disabled", "disabled");
				professione1 = $("#professione1").val();
				$("#aggiungi").attr("onclick", "qualeAttivita()");
				$("#aggiungi").html("<span class='glyphicon glyphicon-plus'></span> Aggiungi professione");
		
		break;
		case 2:	$('#professione2').attr('disabled','disabled');
				professione2 = $("#professione2").val();
				$("#aggiungi").attr("onclick", "qualeAttivita();");
				$("#aggiungi").html("<span class='glyphicon glyphicon-plus'></span> Aggiungi professione");
		
		break;
		case 3:	$('#professione3').attr('disabled','disabled');
				professione3 = $("#professione3").val();
				$('#aggiungi').hide();
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