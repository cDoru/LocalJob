function accendiSeNotifica(){		//accende la notifica
	$('#sos').attr('class', 'badge badge-important');
	$('#sos').html('!');
}
function spegniSeNotifica(){		//spegne la notifica
	$('#sos').attr('class', 'badge');
	$('#sos').html('.');
}

function mostraPanelNotifiche(){		//apre modal notifica
	$('#panelNotifiche').html('<div class="modal-header">'+
			'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'+
			'<h4>Nuova richiesta di preventivo</h4>'+
			'</div>'+
			'<div class="modal-body">'+
			'<p>Un utente richiede il tuo preventivo. Vuoi visualizzare la sua richiesta?</p>'+
			'</div>'+
			'<div class="modal-footer">'+
			'<a href="#" class="btn" data-dismiss="modal">Annulla</a>'+
			'<a href="preventivoRichiesto.html" class="btn btn-primary">Visualizza</a>'+
			'</div>');
	
	$('#panelNotifiche').modal('show');
}


/**		FUNZIONI PAGINA preventivoRichiesto.html  **/
function mostraPanelFoto(){		//apre ingrandimento della foto
	$('#panelFoto').modal('show');
}

function preventivoRichiesto(){				//aggiorna la pagina "preventivoRichiesto" con i dati del cliente
	//$('#loading').fadeIn('fast');			//schermata di caricamento
	
	//sistemare la chiamata
	/*requestID = notifica.requestId;
	jobRequired = notifica.job;
	titolo = notifica.problemTitle;
	descrizione = notifica.description;
	via = notifica.position;
	foto = notifica.picture;
	alert(requestID+" "+jobRequired+" "+titolo+" "+descrizione+" "+via);*/
	var requestID = "01";
	var jobRequired = "ciappinaro";
	var titolo = "aiuto aiuto";
	var descrizione = "bla bla bla cha cha cha";
	var via = "via senza nome 44";	
	var foto = "./img/example_photo.png";
	
	
	//creiamo praticamente da zero la pagina, così la possiamo riutilizzare anche per lo storico degli interventi
	$('#titoloIntervento').html(titolo);
	$('#foto').attr('src', foto);
	$('#fotoGrande').attr('src', foto);		//dentro a panelFoto
	$('#descrizione2').html(descrizione);
	$('#lavoro').html(jobRequired);
	$('#luogo').html(via);
	$('#bottoni').html('<a class="btn btn-large btn-block btn-inverse" href="javascript:mostraPanelPreventivo()">FORNISCI PREVENTIVO</a>'+
					   '<a class="btn btn-large btn-block btn-inverse" href="#">RIFIUTA</a>');
}

function mostraPanelPreventivo(){			//mostra il modal in cui inserire in preventivo
	$('#panelPreventivo').modal('show');
}

function getPreventivo(){		//raccoglie i dati dal form e (per ora) non ci fa assolutamente nulla
	cifra =  $('#cifraMin').val() +' '+ $('#cifraMax').val();
	tempo =  $('#tempoOre').val() +' '+ $('#tempoMin').val();
	alert(cifra +" "+ tempo);
}


/**		FUNZIONI PAGINA preventivoMostrato.html  **/
function preventivoMostrato(){				//aggiorna la pagina "preventivoRichiesto" con i dati del cliente
	//$('#loading').fadeIn('fast');			//schermata di caricamento
	
	//sistemare la chiamata
	/*alert("una answer!");
	requestID = notifica.requestId;
	professionalNickname = notifica.nickname;
	professionalID = notifica.idprofessionista;
	prezzo = notifica.priceRange;
	tempo = notifica.expectedTime;
	alert(requestID+" "+professionalNickname+" "+professionalID+" "+prezzo+" "+tempo);*/
	var professionalNickname = "Gigi";
	var cifra = "30-50";
	var orario = "1h e 20min";
	
	$('#nickPro').html(professionalNickname);
	$('#cifra').html(cifra);
	$('#orario').html(orario);
}