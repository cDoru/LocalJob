var tipoLavoro;


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
	    		sessionStorage.nicknameProfessionista = notifica.nickname;
	    		sessionStorage.idprofessionista = notifica.idprofessionista;
	    		sessionStorage.priceRange = notifica.priceRange;
	    		sessionStorage.expectedTime = notifica.expectedTime;
	    		
    	   		$('#sos_link').attr('href', 'javascript:notificaAnswer()');	//attiva il link del bottone
    	   		break;
       
       case 'decline':
    	   		sessionStorage.requestID = notifica.requestId;
    	   		$('#sos_link').attr('href', 'javascript:notificaDecline()');	//attiva il link del bottone
				break;       
       
       case 'info':
    	   		sessionStorage.type = "notificaInfo";		//variabile di controllo
    	   		sessionStorage.requestID = notifica.requestId;
    	   		sessionStorage.name = notifica.name;
    	   		sessionStorage.surname = notifica.surname;
    	   		sessionStorage.number = notifica.number;
    	   		sessionStorage.address = notifica.address;	
    	   		
    	   		$('#sos_link').attr('href', 'javascript:notificaInfo()');	//attiva il link del bottone
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
	$('#modalFooter').html('<a href="javascript:accendiSeNotifica()" class="btn" data-dismiss="modal">Annulla</a>'+
						   '<a href="mostraQualcosa.html" class="btn btn-primary">Visualizza</a>');
	$('#panelNotifiche').modal('show');
	spegniSeNotifica();
}
function notificaAnswer() {
	$('#modalHeader').html('Nuova offerta di intervento');
	$('#modalBody').html('<p>Un professionista ti ha inviato il preventivo. Vuoi visualizzare la sua offerta?</p>');
	$('#modalFooter').html('<a href="javascript:accendiSeNotifica()" class="btn" data-dismiss="modal">Annulla</a>'+
						   '<a href="mostraQualcosa.html" class="btn btn-primary">Visualizza</a>');
	
	$('#panelNotifiche').modal('show');
	spegniSeNotifica();
}
function notificaDecline() {
	$('#modalHeader').html('Preventivo rifiutato');
	$('#modalBody').html('<p>Il preventivo da lei inviato non \&eacute; stato accettato dal cliente. Grazie comunque!</p>');
	$('#modalFooter').html('<a href="javascript:tornaHome()" class="btn btn-primary" data-dismiss="modal">Chiudi</a>');
	
	$('#panelNotifiche').modal('show');
	spegniSeNotifica();
}
function notificaInfo() {
	$('#modalHeader').html('Preventivo accettato');
	$('#modalBody').html('<p>Un cliente ha accettato il tuo preventivo. Attende che lo contatti, vuoi visualizzare i suoi dati?</p>');
	$('#modalFooter').html('<a href="javascript:accendiSeNotifica()" class="btn" data-dismiss="modal">Annulla</a>'+
						   '<a href="mostraQualcosa.html" class="btn btn-primary">Visualizza</a>');
	
	$('#panelNotifiche').modal('show');
	spegniSeNotifica();
	}

/*
 * Cosa visualizzare in "mostraQualcosa.html"
 */
function cosaMostro(){
    switch( sessionStorage.job )
    {
       case '0':  

            tipoLavoro =    "Caldaista"; 
                break;       
       case '1':
                tipoLavoro =    "Idraulico"; 
                break;

        case '2':  

           tipoLavoro =    "Pittore"; 
                break;   

        case '3':  

            tipoLavoro =    "Elettricista";     
                break;   

        case '4':  

            tipoLavoro =    "Muratore"; 
                break;   

        case '5':  

            tipoLavoro =    "Antennista";     
                break;   

        case '6':  

            tipoLavoro =    "Sarto";    
                break;   

        case '7':  

            tipoLavoro =    "Calzolaio";     
                break;   

        case '8':  

            tipoLavoro =    "Meccanico";    
                break;  

        case '9':  

            tipoLavoro =    "Carpentiere";    
                break;   

        case '10':  

            tipoLavoro =    "Falegname";    
                break;    



    }


	switch(sessionStorage.type)
    {
       case 'notificaRequest':  
    	   
    	 //controllo che la richiesta non sia già stata accettata da un altro
    		


    		$.ajax({
    			async: false,
    			type: 'GET',
    			url: 'http://95.141.45.174/status/'+sessionStorage.requestID+'/',			
    			crossDomain:true,
    			complete: function(){$('#loading').fadeOut('fast')},		//nasconde la schermata di caricamento
    			success: function(data){
    				//se lo stato è maggiore di 2 vuol dire che l'intervento è già stato accettato o annullato
    				if(data > 2){
    					$('#titoloPagina').html('Richiesta di intervento già accettata o annullata');
    	    	   		$('#corpoPagina').html('Qualche tuo collega è stato più rapido, e il cliente ha già accettato il suo lavoro. Riprova la prossima volta!');
    	    	   		$('#bottoniPagina').html('<a class="btn btn-large btn-block btn-success" href="javascript:tornaHome()">TORNA ALLA HOME</a>');
    				}
    				//l'intervento è ancora libero
    				else{
    					$('#titoloPagina').html('Nuova richiesta di intervento,<br/>ecco i dettagli del lavoro:');
    	    	   		$('#corpoPagina').html('<a href="javascript:mostraPanelFoto()">'+
    	    	   				'<img id="foto" src="http://95.141.45.174/'+sessionStorage.picture+'" style="width:100px;"/></a><br/>'+
    	    					'Tappa sulla foto per ingrandirla'+
    	    		    		'<div id="descrizione"><h5 id="titoloIntervento" style="text-transform:uppercase;">'+sessionStorage.problemTitle+'</h5>'+
    	    		    		'<p id="descrizione2">'+sessionStorage.description+'</p></div>'+
    	    		    		'<div><b>RICHIESTO:</b> '+tipoLavoro+'</div>'+
    	    		    		'<div style="margin-bottom:20px;"><b>PRESSO:</b> '+sessionStorage.position+'</div>');
    	    	   		$('#bottoniPagina').html('<a class="btn btn-large btn-block btn-success" href="javascript:mostraPanelPreventivo()">FORNISCI PREVENTIVO</a>'+
    	    	   				'<a class="btn btn-large btn-block btn-inverse" href="javascript:tornaHome()">RIFIUTA</a>');
    	    	   		
    	    	   		$('#fotoGrande').attr('src', 'http://95.141.45.174/'+sessionStorage.picture);		//dentro a panelFoto
    				}
    			},
    			error: errorHandler
    		});
    	   
    		break;
    	   		
       case 'notificaAnswer':	
    	   		$('#titoloPagina').html('Nuova offerta di intervento,<br/>ecco i dettagli del preventivo:');
    	   		$('#corpoPagina').html('<div>'+sessionStorage.nicknameProfessionista+' si &egrave; offerto per il lavoro.</div><br/>'+
    	   				'<div><b>FASCIA DI PREZZO STIMATA:</b><br/>'+sessionStorage.priceRange+'</div><br/>'+
    	   				'<div><b>TEMPO DI ARRIVO STIMATO:</b><br/>'+sessionStorage.expectedTime+'</div><br/>');
    	   		$('#bottoniPagina').html('<a class="btn btn-large btn-block btn-success" href="javascript:accettaPreventivo()">ACCETTA PREVENTIVO</a>'+
   				'<a class="btn btn-large btn-block btn-inverse" href="javascript:rifiutaPreventivo();">RIFIUTA</a>');
    	   		break;
    	   		
       case 'notificaInfo':
    	   		$('#titoloPagina').html('Preventivo accettato,<br/>ecco i dati per contattare il cliente:');
    	   		$('#corpoPagina').html('<div><b>NOME:</b> '+sessionStorage.name+' '+sessionStorage.surname+'</div><br/>'+
    	   				'<div><b>NUMERO:</b> '+sessionStorage.number+'</div><br/>'+
    	   				'<div><b>INDIRIZZO: </b>'+sessionStorage.address+'</div><br/>');
    	   		$('#bottoniPagina').html('<a class="btn btn-large btn-success btn-block" type="button" href="tel:'+sessionStorage.number+'">'+
    	   				'<img id="icoCall" src="./img/glyphicons/white_ver/170.PNG"/>&nbsp;&nbsp;CONTATTA </a><br/>'+
   						'<a class="btn btn-large btn-block btn-inverse" href="interventi-attivi.html">CONCLUDI</a>');
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
	//sendPreventivo();
}

function sendPreventivo(){		//raccoglie i dati dal form e (per ora) non ci fa assolutamente nulla
	cifraMin = $('#cifraMin').val();
	cifraMax = $('#cifraMax').val();
	tempoOre = $('#tempoOre').val();
	tempoMin = $('#tempoMin').val();
	
	if (cifraMin == "" || cifraMax == "" || (tempoOre == "" && tempoMin == ""))
		{
			alert("Tutti i campi sono obbligatori");
		}
	else {
			cifra =  cifraMin +' - '+ cifraMax;
			tempo =  tempoOre +'h'+ tempoMin;
			
			/*
			 * Invia al server il preventivo
			 */
			$.ajax({
		        type: 'POST',
		        url: 'http://95.141.45.174/answers',
		        contentType: 'application/x-www-form-urlencoded',
		        crossDomain: true,
		        data: {'requestId': sessionStorage.requestID, 
		      	  'priceRange': cifra, 
		      	  'expectedTime': tempo, 
		      	  'nickname': localStorage.nickname    	  
		      	  },
		        complete: function(){$('#loading').fadeOut('fast')},		//nasconde la schermata di caricamento
		        success: inviaPreventivo,
		        error: errorHandler
			});
		}
}

function inviaPreventivo(data){
 	window.location='preventivo-inviato.html';
}

function rifiutaPreventivo(){
	
	$.ajax({
        type: 'POST',
        url: 'http://95.141.45.174/decline',
        contentType: 'application/x-www-form-urlencoded',
        crossDomain: true,
        data: {'requestId': sessionStorage.requestID, 
      	  'professionalId': sessionStorage.idprofessionista,
      	  'nickname': sessionStorage.nicknameProfessionista
      	  },
        complete: function(){$('#loading').fadeOut('fast')},		//nasconde la schermata di caricamento
        success: tornaHome,
        error: errorHandler
	});
	
}

function accettaPreventivo(){
	
	$.ajax({
        type: 'POST',
        url: 'http://95.141.45.174/accept',
        contentType: 'application/x-www-form-urlencoded',
        crossDomain: true,
        data: {'requestId': sessionStorage.requestID,
        	'professionalId': sessionStorage.idprofessionista,
        	'nikname': sessionStorage.nickname
        },
        //il professionistaID non glielo passo ok?
        complete: function(){$('#loading').fadeOut('fast')},		//nasconde la schermata di caricamento
        success: preventivoAccettato,
        error: errorHandler
	});
	
}

function preventivoAccettato(){
	window.location='preventivo-accettato.html';
}

function tornaHome(){
	window.location='interventi-attivi.html';
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