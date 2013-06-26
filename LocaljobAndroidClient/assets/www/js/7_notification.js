/* 
 * Funzioni per: mostraQualcosa.html
 * (visualizzazione informazioni da notifiche)
 */

//PERSONALIZZA LA PAGINA "mostraQualcosa" CON LE INFORMAZIONI NOTIFICATE
function cosaMostro()
{	
	$('#loading').fadeIn('fast');
	//determina il tipo di mestiere necessario al cliente
	tipoLavoro = qualeMestiere();

	switch(sessionStorage.type)
    {
       case 'notificaRequest':  
    	   //prima di tutto controlla che la richiesta non sia già stata accettata da altri
    		$.ajax({
    			async: false,
    			type: 'GET',
    			url: 'http://95.141.45.174/status/'+sessionStorage.requestID+'/',			
    			crossDomain:true,
    			success: function(data){
    				//se lo stato è maggiore di 2 vuol dire che l'intervento è già stato accettato o annullato
    				if(data > 2)
    				{
    					$('#titoloPagina').html('Richiesta di intervento già accettata o annullata');
    	    	   		$('#corpoPagina').html('Qualche tuo collega è stato più rapido, e il cliente ha già accettato il suo lavoro. Riprova la prossima volta!');
    	    	   		$('#bottoniPagina').html('<a class="btn btn-large btn-block btn-success" href="javascript:tornaHome()">TORNA ALLA HOME</a>');
    	    	   		$('#loading').fadeOut('fast');
    				}else
    				//l'intervento è ancora libero
    				{
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
    	    	   		$('#loading').fadeOut('fast');
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
    	   		$('#loading').fadeOut('fast');
    	   		break;
    	   		
       case 'notificaInfo':
    	   		$('#titoloPagina').html('Preventivo accettato,<br/>ecco i dati per contattare il cliente:');
    	   		$('#corpoPagina').html('<div><b>NOME:</b> '+sessionStorage.name+' '+sessionStorage.surname+'</div><br/>'+
    	   				'<div><b>NUMERO:</b> '+sessionStorage.number+'</div><br/>'+
    	   				'<div><b>INDIRIZZO: </b>'+sessionStorage.address+'</div><br/>');
    	   		$('#bottoniPagina').html('<a class="btn btn-large btn-success btn-block" type="button" href="tel:'+sessionStorage.number+'">'+
    	   				'<img id="icoCall" src="./img/glyphicons/white_ver/170.PNG"/>&nbsp;&nbsp;CONTATTA </a><br/>'+
   						'<a class="btn btn-large btn-block btn-inverse" href="interventi-attivi.html">CONCLUDI</a>');
    	   		$('#loading').fadeOut('fast');
    	   		break;
    }
}

//DETERMINA IL TIPO DI MESTIERE RICHIESTO
function qualeMestiere()
{
	switch(sessionStorage.job)
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
	return tipoLavoro;
}

//MOSTRA MODAL INSERIMENTO PREVENTIVO - PAGINA "mostraQualcosa.html"
function mostraPanelPreventivo()
{
	$('#panelPreventivo').modal('show');
}

//INVIO AL SERVER DEI DATI DEL PREVENTIVO
function sendPreventivo()
{
	$('#loading').fadeIn('fast');
	cifraMin = $('#cifraMin').val();
	cifraMax = $('#cifraMax').val();
	tempoOre = $('#tempoOre').val();
	tempoMin = $('#tempoMin').val();
	
	//fa il check dei campi vuoti
	if (cifraMin == "" || cifraMax == "" || (tempoOre == "" && tempoMin == ""))
		{
			alert("Tutti i campi sono obbligatori");
		}else
		{
			cifra =  cifraMin +' - '+ cifraMax;
			tempo =  tempoOre +'h'+ tempoMin;
			
			//Invia al server il preventivo
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
		        complete: function(){$('#loading').fadeOut('fast')},
		        success: function(){window.location='preventivo-inviato.html';},
		        error: errorHandler
			});
		}
}

//GESTIONE DEL RIFIUTO DEL PREVENTIVO
function rifiutaPreventivo()
{	
	$('#loading').fadeIn('fast');
	$.ajax({
        type: 'POST',
        url: 'http://95.141.45.174/decline',
        contentType: 'application/x-www-form-urlencoded',
        crossDomain: true,
        data: {'requestId': sessionStorage.requestID, 
      	  'professionalId': sessionStorage.idprofessionista,
      	  'nickname': sessionStorage.nicknameProfessionista
      	  },
        complete: function(){$('#loading').fadeOut('fast')},
        success: function(){window.location='interventi-attivi.html';},
        error: errorHandler
	});	
}

//GESTIONE DELL'ACCETTAZIONE DEL PREVENTIVO
function accettaPreventivo()
{
	$('#loading').fadeIn('fast');
	$.ajax({
        type: 'POST',
        url: 'http://95.141.45.174/accept',
        contentType: 'application/x-www-form-urlencoded',
        crossDomain: true,
        data: {'requestId': sessionStorage.requestID,
        	'professionalId': sessionStorage.idprofessionista,
        	'nikname': sessionStorage.nickname
        },
        complete: function(){$('#loading').fadeOut('fast')},
        success: function(){window.location='preventivo-accettato.html';},
        error: errorHandler
	});	
}