function elaboraNotifica(notifica) {
//notifica sarebbe un e.payload che contiene quindi i vocabolari JSON
	
	accendiSeNotifica(); 	//colora il bottone notifica
	switch( notifica.notificationType )
    {
       case 'request':  
    	   		sessionStorage.type = "notificaRequest";		//variabile di controllo 
    	   		sessionStorage.requestID = notifica.requestId;
    	   		sessionStorage.job = notifica.job;
    	   		sessionStorage.problemTitle = notifica.problemTitle;
    	   		sessionStorage.description = notifica.description;
    	   		sessionStorage.position = notifica.position;	
    	   		sessionStorage.picture = notifica.picture;
	    	     
    	   		$('#sos_link').attr('href', 'javascript:notificaRequest()');	//attiva il link del bottone
    	   		break;       
       case 'answer':
	    	    sessionStorage.type = "notificaAnswer";		//variabile di controllo
	    		sessionStorage.requestID = notifica.requestId;
	    		sessionStorage.nickname = notifica.nickname;
	    		sessionStorage.idprofessionista = notifica.idprofessionista;
	    		sessionStorage.priceRange = notifica.priceRange;
	    		sessionStorage.expectedTime = notifica.expectedTime;
	    		
    	   		$('#sos_link').attr('href', 'javascript:notificaAnswer()');	//attiva il link del bottone
    	   		alert("answer");
				break;
       
       case 'decline':
    	   		sessionStorage.requestID = notifica.requestId;
    	   		$('#sos_link').attr('href', 'javascript:notificaDecline()');	//attiva il link del bottone
    	   		alert("decline");
				break;       
       
       case 'info':
    	   		sessionStorage.type = "notificaInfo";		//variabile di controllo
    	   		sessionStorage.requestID = notifica.requestId;
    	   		sessionStorage.name = notifica.name;
    	   		sessionStorage.surname = notifica.surname;
    	   		sessionStorage.number = notifica.number;
    	   		sessionStorage.address = notifica.address;	
    	   		
    	   		$('#sos_link').attr('href', 'javascript:notificaInfo()');	//attiva il link del bottone
    	   		alert("request");
				break;
        
       default:
    	   		alert("Notifica errata");
       			break;
    }
}


/*
 * Gestione delle diverse tipologie di notifiche
 */
function notificaRequest() {
	$('#modalHeader').html('Nuova richiesta di intervento');
	$('#modalBody').html('<p>Un utente richiede il tuo preventivo. Vuoi visualizzare la sua richiesta?</p>');
	$('#modalFooter').html('<a href="javascript:rifiuta()" class="btn" data-dismiss="modal">Annulla</a>'+
						   '<a href="mostraQualcosa.html" class="btn btn-primary">Visualizza</a>');
	$('#panelNotifiche').modal('show');
	spegniSeNotifica();
}
function notificaAnswer() {
	$('#modalHeader').html('Nuova offerta di intervento');
	$('#modalBody').html('<p>Un professionista ti ha inviato il preventivo. Vuoi visualizzare la sua offerta?</p>');
	$('#modalFooter').html('<a href="javascript:rifiuta()" class="btn" data-dismiss="modal">Annulla</a>'+
						   '<a href="mostraQualcosa.html" class="btn btn-primary">Visualizza</a>');
	
	$('#panelNotifiche').modal('show');
	spegniSeNotifica();
}
function notificaDecline() {
	$('#modalHeader').html('Preventivo rifiutato');
	$('#modalBody').html('<p>Il preventivo numero '+sessionStorage.requestID+' non è stato accettato dal cliente. Grazie comunque!</p>');
	$('#modalFooter').html('<a href="javascript:rifiuta()" class="btn btn-primary" data-dismiss="modal">Chiudi</a>');
	
	$('#panelNotifiche').modal('show');
	spegniSeNotifica();
}
function notificaInfo() {
	$('#modalHeader').html('Preventivo accettato');
	$('#modalBody').html('<p>Un cliente ha accettato il tuo preventivo. Attende che lo contatti, vuoi visualizzare i suoi dati?</p>');
	$('#modalFooter').html('<a href="javascript:rifiuta()" class="btn" data-dismiss="modal">Annulla</a>'+
						   '<a href="mostraQualcosa.html" class="btn btn-primary">Visualizza</a>');
	
	$('#panelNotifiche').modal('show');
	spegniSeNotifica();
	}

/*
 * Cosa visualizzare in "mostraQualcosa.html"
 */
function cosaMostro(){
	switch(sessionStorage.type)
    {
       case 'notificaRequest':  
    	   		$('#titoloPagina').html('Nuova richiesta di intervento,<br/>ecco i dettagli del lavoro:');
    	   		$('#corpoPagina').append('<a href="javascript:mostraPanelFoto()">'+
    	   				'<img id="foto" src="http://95.141.45.174/'+sessionStorage.picture+'" style="width:100px;"/></a><br/>'+
    					'Tappa sulla foto per ingrandirla'+
    		    		'<div id="descrizione"><h5 id="titoloIntervento" style="text-transform:uppercase;">'+sessionStorage.problemTitle+'</h5>'+
    		    		'<p id="descrizione2">'+sessionStorage.description+'</p></div>'+
    		    		'<div><b>RICHIESTO:</b> '+sessionStorage.job+'</div>'+
    		    		'<div style="margin-bottom:20px;"><b>PRESSO:</b> '+sessionStorage.position+'</div>');
    	   		$('#bottoniPagina').html('<a class="btn btn-large btn-block btn-inverse" href="javascript:mostraPanelPreventivo()">FORNISCI PREVENTIVO</a>'+
    	   				'<a class="btn btn-large btn-block btn-inverse" href="#">RIFIUTA</a>');
    	   		
    	   		$('#fotoGrande').attr('src', sessionStorage.picture);		//dentro a panelFoto
    	   		break;
    	   		
       case 'notificaAnswer':	
    	   		$('#titoloPagina').html('Nuova offerta di intervento,<br/>ecco i dettagli del preventivo:');
    	   		$('#corpoPagina').html('<div>'+sessionStorage.nickname+' si è offerto per il lavoro.</div><br/>'+
    	   				'<div><b>FASCIA DI PREZZO STIMATA:</b><br/>'+sessionStorage.priceRange+'</div><br/>'+
    	   				'<div><b>TEMPO DI ARRIVO STIMATO:</b><br/>'+sessionStorage.expectedTime+'</div><br/>');
    	   		$('#bottoniPagina').html('<a class="btn btn-large btn-block btn-inverse" href="#">ACCETTA PREVENTIVO</a>'+
   				'<a class="btn btn-large btn-block btn-inverse" href="#">RIFIUTA</a>');
    	   		break;
    	   		
       case 'notificaInfo':
    	   		$('#titoloPagina').html('Preventivo accettato,<br/>ecco i dati per contattare il cliente:');
    	   		$('#corpoPagina').html('<div><b>NOME:</b> '+sessionStorage.name+' '+sessionStorage.surname+'</div><br/>'+
    	   				'<div><b>NUMERO:</b> '+sessionStorage.number+'</div><br/>'+
    	   				'<div><b>INDIRIZZO: </b>'+sessionStorage.address+'</div><br/>');
    	   		$('#bottoniPagina').html('<a class="btn btn-large btn-block btn-inverse" href="#">CONTATTA</a>'+
   				'<a class="btn btn-large btn-block btn-inverse" href="#">ANNULLA</a>');
    	   		break;
        
       default:
    	   		alert("Huston, abbiamo un problema");
       			break;
    }
}


/*
 * Funzioni dei panel di "mostraQualcosa.html"
 */
function mostraPanelFoto(){		//apre ingrandimento della foto
	$('#panelFoto').modal('show');
}

function mostraPanelPreventivo(){			//mostra il modal in cui inserire in preventivo
	$('#panelPreventivo').modal('show');
}

function getPreventivo(){		//raccoglie i dati dal form e (per ora) non ci fa assolutamente nulla
	cifra =  $('#cifraMin').val() +' '+ $('#cifraMax').val();
	tempo =  $('#tempoOre').val() +' '+ $('#tempoMin').val();
	alert(cifra +" "+ tempo);
}


/*
 *	Gestione del bottone di notifica 
 */
function accendiSeNotifica(){		//accende la notifica
	$('#sos').attr('class', 'badge badge-important');
	$('#sos').html('!');
}
function spegniSeNotifica(){		//spegne la notifica
	$('#sos').attr('class', 'badge');
	$('#sos').html('.');
	$('#sos_link').attr('href','#');
}