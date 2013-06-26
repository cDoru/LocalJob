/*
 * Funzioni richiamate da tutte le pagine html
 */

document.addEventListener('deviceready', partenza, true);

var DEBUG = true;

//AL CARICAMENTO DELLA PAGINA
function partenza()
{	
	jQuery.support.cors = true;

	//per il tooltip (notifiche)
	$('.notifiche').popover({
		'html': 'true',
        'selector': '',
        'placement': 'bottom',
        'title': 'Notifiche',
        'content': '<div class="well well-small">Guarda il tutorial di Local Job</div>'+
        '<div class="well well-small">Aggiorna il tuo profilo per iniziare</div>',
        'container': '.contNotifiche'
      });

	//Listen for orientation changes
	window.addEventListener("orientationchange", function() {
  		
  		//Announce the new orientation number
  		if(window.orientation == 0 && (location.href).indexOf("home") == -1)
  		{
  			//Non sono nella mappa, quindi non faccio niente
  			location.href = 'interventi-attivi.html';
  		}
  		if(window.orientation == 90 && (location.href).indexOf("home") == -1)
  		{
  			//orientamento verso sinistra
  			location.href = 'map-landscape.html';
  		}
  		if(window.orientation == -90 && (location.href).indexOf("home") == -1)
  		{
			//orientamento verso destra
  			location.href = 'map-landscape.html';
  		}
	}, false);
}

function initiate_geolocation()
{ 
	//getCurrentPosition rileva la posizione solo una volta
    navigator.geolocation.getCurrentPosition(handle_geolocation_query,handle_errors);
    
    //watchPosition rileva la posizione ogni tot secondi
    //navigator.geolocation.watchPosition(inCasoDiSuccesso);
}
function handle_geolocation_query(position)
{  
	position_lat = position.coords.latitude;
	sessionStorage.lat = position_lat;
	position_long = position.coords.longitude;
	sessionStorage.long = position_long;
	
	//se la chiamata proviene da ricercaInZona
	if(controller_geolocation == "ricercaInZona")
	{
		ricercaInZona(sessionStorage.filtroPrecedente, "");
	}
	else
	{
		initialize_map("altro", position_lat, position_long);
		//usa le Google API per derivare le altre informazioni
		codeLatLng(position_lat, position_long);
	}
}  
function handle_errors(error)  
{  
    switch(error.code)  
    {  
        case error.PERMISSION_DENIED: alert("user did not share geolocation data");  
        break;  
        case error.POSITION_UNAVAILABLE: alert("could not detect current position");  
        break;  
        case error.TIMEOUT: alert("retrieving position timed out");  
        break;  
        default: alert("unknown error");  
        break;  
    }  
}  

//GESTIONE NOTIFICHE
function onNotificationGCM(e)
{
    switch( e.event )
    {
       case 'registered':
			if ( e.regid.length > 0 )
			{
				sessionStorage.googlecod = e.regid;
				window.location='home.html';
			}
	        break;   
        
        case 'message':        	
			alert('Hai una nuova notifica');

			//salvo la notifica in localStorage per poterla gestire anche con l'app chiusa
			localStorage.setItem('notification', JSON.stringify(e.payload));
			elaboraNotifica(e.payload);
			break;
        
        case 'error':
			alert(e.msg);
			break;
        
        default:
			alert('EVENT -> Unknown, an event was received and we do not know what it is');
        	break;
    }
}

function tokenHandler (result)
{
    alert('token: '+ result);
}

function errorHandler (xhr,textStatus,thrownError)
{
    alert('error:'+ xhr.status + ' ' + thrownError + ' ' + textStatus + ' ' + xhr.responseText);
}

//CONTROLLO DELL'IMMAGINE - SE NON CARICATA IMPOSTA DEFAULT
function controlloFotoDefault(picture)
{
	pic = picture;
	if (picture == 'Photo' || picture == 'photo' || picture == '' || picture.length == 0)
	{
		picture = './img/missingAvatar.png';
	}else
	{
		picture = 'http://95.141.45.174'+pic;
	}
	return picture;
}

//NEL MENU A TENDINA PER MOSTRARE SUL BOTTONE L'ELEMENTO SELEZIONATO
function menuTendina()
{
	$(".dropdown-menu li a").click(function(){
    
    $("#tendina:first-child").html($(this).text()+ ' <span class="caret"></span>');
    $("#tendina:first-child").val($(this).text());
  });
}

//GESTIONE DELLA CHIUSURA DELL'APP
function confermaUscita()
{
	navigator.notification.confirm(
		'Vuoi davvero chiudere la app?',  
		exitFromApp,            
		'Uscita',            
 		'OK,Annulla');
}
function exitFromApp(buttonIndex)
{
   if (buttonIndex==1)
   {	
	  //prima di uscire fa il logout
	  $.ajax({
			async: false,
			type: 'GET',
			url: 'http://95.141.45.174/logout',			
			crossDomain:true,
			success: function(){
				//svuota le variabili session e local
				localStorage.clear();
				sessionStorage.clear();
				//e infine esce
				navigator.app.exitApp();		
			},
			error: errorHandler
		});	  
	}
}

//notifica e' un e.payload che contiene i vocabolari JSON
function elaboraNotifica(notifica)
{	
	//illumina il bottone notifica
	accendiSeNotifica();
	switch(notifica.notificationType)
    {
       case 'request':  
    	   		//salva in sessionStorage per mantenere i dati tra le pagine
    	   		sessionStorage.type = "notificaRequest";	//variabile di controllo 
    	   		sessionStorage.requestID = notifica.requestId;
    	   		sessionStorage.job = notifica.job;
    	   		sessionStorage.problemTitle = notifica.problemTitle;
    	   		sessionStorage.description = notifica.description;
    	   		sessionStorage.position = notifica.position;	
    	   		sessionStorage.picture = notifica.picture;
    	   		//attiva il link del bottone notifica
    	   		$('#sos_link').attr('href', 'javascript:notificaRequest()');	//attiva il link del bottone
    	   		break;     
    	   		
       case 'answer':
	    	    sessionStorage.type = "notificaAnswer";		//variabile di controllo
	    		sessionStorage.requestID = notifica.requestId;
	    		sessionStorage.nicknameProfessionista = notifica.nickname;
	    		sessionStorage.idprofessionista = notifica.idprofessionista;
	    		sessionStorage.priceRange = notifica.priceRange;
	    		sessionStorage.expectedTime = notifica.expectedTime;
    	   		$('#sos_link').attr('href', 'javascript:notificaAnswer()');
    	   		break;
       
       case 'decline':
    	   		sessionStorage.requestID = notifica.requestId;
    	   		$('#sos_link').attr('href', 'javascript:notificaDecline()');
				break;       
       
       case 'info':
    	   		sessionStorage.type = "notificaInfo";		//variabile di controllo
    	   		sessionStorage.requestID = notifica.requestId;
    	   		sessionStorage.name = notifica.name;
    	   		sessionStorage.surname = notifica.surname;
    	   		sessionStorage.number = notifica.number;
    	   		sessionStorage.address = notifica.address;	
    	   		$('#sos_link').attr('href', 'javascript:notificaInfo()');
				break;
        
       default:
    	   		alert("Notifica errata");
       			break;
    }
}


//IMPOSTA E MOSTRA IL MODAL PER LE NOTIFICHE REQUEST
function notificaRequest()
{
	//imposta il contenuto del modal
	$('#modalHeader').html('Nuova richiesta di intervento');
	$('#modalBody').html('<p>Un utente richiede il tuo preventivo. Vuoi visualizzare la sua richiesta?</p>');
	$('#modalFooter').html('<a href="javascript:accendiSeNotifica()" class="btn" data-dismiss="modal">Annulla</a>'+
						   '<a href="mostraQualcosa.html" class="btn btn-primary">Visualizza</a>');
	//mostra il modal
	$('#panelNotifiche').modal('show');
	//spegne il bottone notifica
	spegniSeNotifica();
}
//IMPOSTA E MOSTRA IL MODAL PER LE NOTIFICHE ANSWER
function notificaAnswer()
{
	$('#modalHeader').html('Nuova offerta di intervento');
	$('#modalBody').html('<p>Un professionista ti ha inviato il preventivo. Vuoi visualizzare la sua offerta?</p>');
	$('#modalFooter').html('<a href="javascript:accendiSeNotifica()" class="btn" data-dismiss="modal">Annulla</a>'+
						   '<a href="mostraQualcosa.html" class="btn btn-primary">Visualizza</a>');
	$('#panelNotifiche').modal('show');
	spegniSeNotifica();
}
//IMPOSTA E MOSTRA IL MODAL PER LE NOTIFICHE DECLINE
function notificaDecline()
{
	$('#modalHeader').html('Preventivo rifiutato');
	$('#modalBody').html('<p>Il preventivo da lei inviato non \&eacute; stato accettato dal cliente. Grazie comunque!</p>');
	$('#modalFooter').html('<a href="javascript:tornaHome()" class="btn btn-primary" data-dismiss="modal">Chiudi</a>');
	$('#panelNotifiche').modal('show');
	spegniSeNotifica();
}
//IMPOSTA E MOSTRA IL MODAL PER LE NOTIFICHE INFO
function notificaInfo()
{
	$('#modalHeader').html('Preventivo accettato');
	$('#modalBody').html('<p>Un cliente ha accettato il tuo preventivo. Attende che lo contatti, vuoi visualizzare i suoi dati?</p>');
	$('#modalFooter').html('<a href="javascript:accendiSeNotifica()" class="btn" data-dismiss="modal">Annulla</a>'+
						   '<a href="mostraQualcosa.html" class="btn btn-primary">Visualizza</a>');
	$('#panelNotifiche').modal('show');
	spegniSeNotifica();
}

//GESTIONE GRAFICA DEL BOTTONE DI NOTIFICA
function accendiSeNotifica()
{
	$('#sos').attr('class', 'badge badge-important');
	$('#sos').html('!');
}
function spegniSeNotifica()
{
	localStorage.removeItem('notification');
	$('#sos').attr('class', 'badge');
	$('#sos').html('.');
	$('#sos_link').attr('href','#');
}

//APRE INGRANDIMENTO FOTO - PAGINA "mostraQualcosa.html"
function mostraPanelFoto()
{
	$('#panelFoto').modal('show');
}