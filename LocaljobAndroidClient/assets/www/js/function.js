var DEBUG = true;

var tipoUtente;
var position_lat;
var position_long;
var controller_geolocation;

var geocoder;
var marker;

var xml_case;
var filtroIntervento;

var user;
var logged = false;

var orderType;
//localStorage.notificaSalvata = "";
//var googlecod;

//SE SEI DA PC DECOMMENTA QUESTA VARIABILE E TI CONNETTI
//sessionStorage.googlecod = "5";


/*
//script per il form della data di nascita

var firstYear = 1920;
var lastYear = 1999;
for(var i =firstYear; i<=lastYear; i++) {
       $('#anni').append('<option>'+i+'</option>');
}
*/


/*
 * Ricezione notifiche
 */

//handle GCM notifications for Android
function onNotificationGCM(e) {
   //alert(e.event);
    
    switch( e.event )
    {
       case 'registered':
		if ( e.regid.length > 0 )
		{
			// Your GCM push server needs to know the regID before it can push to this device
			// here is where you might want to send it the regID for later use.
			//console.log("regID = " + e.regID);
			sessionStorage.googlecod = e.regid;
			window.location='home.html';
		}
		
        break;   
        
        case 'message':
        	// if this flag is set, this notification happened while we were in the foreground.
        	// you might want to play a sound to get the user's attention, throw up a dialog, etc.
        	
        	/*
        	if (e.foreground)
        	{				
				alert("fore: "+e.payload.prova);
			}
			else
			{	// otherwise we were launched because the user touched a notification in the notification tray.
				if (e.coldstart) {
					alert("cold: "+e.payload.prova);
				}
				
				else {
					alert("back: "+e.payload.prova);
				}
			}
			*/
        	
			alert('Hai una nuova notifica');
			
			/* prova di cavo: salviamo la notifica in una variabile local.storage
			 * in questo modo nell'onload fai sempre un controllo ... se hai una notifica
			 * accendi l'icona
			 */
			localStorage.notificaSalvata = e.payload;
			
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

function tokenHandler (result) {
    alert('token: '+ result);
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
}

function successHandler (result) {
    //alert('success:'+ result);
}

function errorHandler (error) {
    alert('error:'+ error);
}



/*
 * Funzioni per cambi dinamici pagine
 *  
 * */

function cambia_login(){
	//$('#logone').html('<img src="./img/logo_prova.png" style="margin:5%"/>');	
	
	$('#contenitore').html('<h4>Accedi a LocalJob</h4>'+
			'<form class="form-signin" action="javascript:login();">' +
				'<input id="user" type="text" class="input-block-level" placeholder="Username">' +
				'<input id="password" type="password" class="input-block-level" placeholder="Password">' +
				'<div class="btn-toolbar" style="margin: 0;">'+
					'<span align="center">'+
						'<button class="btn btn-large btn-inverse" type="button" onclick="location.reload();" style="width:28%;margin:0 2% 0 0">' +
							'<img src="./img/glyphicons/white_ver/225.PNG" style="height:15px;margin-top:-5px">'+
						'</button>' +
						'<button class="btn btn-large btn-inverse" type="submit" style="width:70%;">Accedi</button>'+
					'</span>' +
				'</div>'+
				'<div align="center" id="password_link"><a href="#">Hai dimenticato la password?</a></div>'+
			'</form>');
}


/*
 * Funzione che salva tutti i dati del problema, e rimanda alla pagina dove ti geolocalizza
 * 
 * */
function saveProblem(){
	
	$('#loading').fadeIn('fast');
	//Salvo i valori nel sessionStorage
	problemTitle =  $('#problemTitle').val(); 
	problemDesription =  $('#problemDesription').val();
	sessionStorage.problemTitle = problemTitle;
	sessionStorage.problemDesription = problemDesription;

	//controllo se l'utente ha inserito l'immagine
	var imgVal = $('#img_work').val(); 
    if(imgVal=='') 
    { 
    	//Non ha caricato l'immagine quindi gli do un immagine di default
    	sessionStorage.problemImg = '/site_media/avatars/132683508668.jpg';
    	window.location='where-are-you.html';
    }
    else{
    	//carico l'immagine nel server
    	var oData = new FormData(document.forms.namedItem("fileinfo"));
    	var oReq = new XMLHttpRequest();
    	oReq.open("POST", "http://95.141.45.174/listinterv/", true); 

    	oReq.onload = function(oEvent) {
    		if (oReq.status == 200) {
    			sessionStorage.problemImg = oReq.responseText;
    			$('#loading').fadeOut('fast');
    			//alert("Uppato!");	
    			window.location='where-are-you.html';
    		} else {
    			oOutput.innerHTML = "Error " + oReq.status + " occurred uploading your file.<br \/>";
    		}
    	};
    		 
    	oReq.send(oData);
    }	
}

function salvaProblemType(num){
	sessionStorage.problemType = num;
}


/*
 * Chiamata al server che controlla se l'utente ha già un indirizzo predefinito oppure no 
 *
 * */
function controlloIndirizzo(){
	//ora per prova facciamo finta che abbia un indirizzo
	//indirizzo = true;
	
	$.ajax({
        type: 'GET',
        url: 'http://95.141.45.174/getaddress/',
        contentType: 'application/x-www-form-urlencoded',
        crossDomain: true,
        success: function(xml){
        	
        	xml_case = $(xml);	
        	// cerco se ci sono indirizzi salvati
        	if($(xml_case).find("home").length > 0){
        		
        		//se ha l'indirizzo vai sul tab casa, prende dal database tutte le info
        		//e le mostra nel form
        		goTabCasa(true);
        	}
        	else{
        		
        		//se non ha indirizzo vai sul tab altro, lo geolocalizzi, ti trova lat e long
        		//e ti inserisce l'indirizzo nel form
        		goTabAltro(false);	
        	}
        	
        },
        error: errorHandler
     })
	
	/*
	if (indirizzo == false){
		goTabAltro(indirizzo);	
	}
	
	else{
		goTabCasa(indirizzo);
		
	}
	*/
}

function goTabAltro(indirizzo){
	
	//Funzione che manda al tab altro (quindi con geolocalizzazione)
	
	//Fai prima un controllo...se non ha indirizzi predefiniti...non ha la 
	//possibilità di cliccare nel tab casa ... altrimenti si
		
		if (indirizzo == false){	
    		//Il tab casa deve essere disabilitato e non ci si può cliccare nulla
    		$('#tab_casa').attr('class','disabled');
    		$('#tab_casa').html('<a>Casa</a>');
		}
		else{
			//Controllo quanti indirizzi ha salvato l'utente
			numero_case = $(xml_case).find("home").size();	
			//Fa un controllo, se c'è solo una casa mostra il tab normale, 
			//altrimenti mostra l'elenco cliccabile
			
			if(numero_case < 2){
				var $casa = $(xml_case).find("home");
				var nome = $casa.find("nome").text();
				// Il tab casa è attivato e viene mostrato il div #tabCasa
		    	$('#tab_casa').attr('class','');
		    	$('#tab_casa').html('<a href="#tabCasa" data-toggle="tab" style="border:1px solid #ffffff;"> '+nome+' </a>');
			}
			else{
				var $casa = $(xml_case).find("home");
				//prendo la prima casa della lista e la metto come principale
				var nome = $casa.find("nome").eq(0).text();			
				$('#tab_casa').attr('class','dropdown');
		    	$('#tab_casa').html('<a href="#" class="dropdown-toggle" data-toggle="dropdown" id="tendina" onclick="menuTendina()" style="border:1px solid #ffffff;"> '+nome+' <span class="caret"></span></a>'+
		    		'<ul id="casaType" class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu"></ul>');	
		    	//per ogni elemento in più che trovo appendo le altre case
		    	for(var i=0; i<numero_case ; i++){
		    		nome_temp = $casa.find("nome").eq(i).text();
		    		$('#casaType').append('<li><a tabindex="-1" href="javascript:mostraCasa('+i+');"> '+nome_temp+' </a></li>');
		    	}
			}
			/*
			$('#tab_casa').attr('class','');
			$('#tab_casa').html('<a onclick="goTabCasa(true);" data-toggle="tab" style="border:1px solid #ffffff;">Casa</a>');
			*/
		}
		//Il tab altro è attivato e viene mostrato il div #tabAltro
		$('#tab_altro').attr('class','active');
		$('#tab_altro').html('<a href="#tabAltro" data-toggle="tab">Altro</a>');
		
		//Attivo la pagina tabAltro e disattivo tabCasa
		$('#tabAltro').attr('class','tab-pane active');
		$('#tabCasa').attr('class','tab-pane');
		
		controller_geolocation = "InvioUrgenza";
		//Fa partire la geolocalizzazione
		initiate_geolocation();
	
}

function initiate_geolocation() { 
	// get current position mi trova solo la posizione 1 volta
    navigator.geolocation.getCurrentPosition(handle_geolocation_query,handle_errors);
    
    // watch position mi trova la posizione ogni tot secondi
    // navigator.geolocation.watchPosition(inCasoDiSuccesso);
}  

function handle_geolocation_query(position){  
	
	position_lat = position.coords.latitude;
	position_long = position.coords.longitude;
	
	sessionStorage.lat = position_lat;
	sessionStorage.long = position_long;
	
	//Se la geolocalizzazione me la richiede la ricerca in zona faccio una cosa
	if(controller_geolocation == "ricercaInZona"){
		//alert("prova filtro 2: "+sessionStorage.filtroPrecedente);
		ricercaInZona(sessionStorage.filtroPrecedente, "");
	}
	//Se la geolocalizzazione me la richiede l'invio urgenza ne faccio un altra
	//else if (controller_geolocation == "InvioUrgenza"){
	else{
		initialize_map("altro", position_lat, position_long);
		//una volta che mi darà la posizione corrente, dalle google API trovo indirizzo ecc
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

/*
 * Funzione che manda al tab casa (quindi senza geolocalizzazione)
 */
function goTabCasa(indirizzo){
	
	//Il tab altro è cliccabile e viene mostrato il div #tabAltro
	$('#tab_altro').attr('class','');
	$('#tab_altro').html('<a onclick="goTabAltro(true)" data-toggle="tab" style="border:1px solid #ffffff;">Altro</a>');	
	//Attivo la pagina tabCasa e disattivo tabAltro
	$('#tabAltro').attr('class','tab-pane');
	$('#tabCasa').attr('class','tab-pane active');
	
	//Controllo quanti indirizzi ha salvato l'utente
	numero_case = $(xml_case).find("home").size();	
	
	//Fa un controllo, se c'è solo una casa mostra il tab normale, 
	//altrimenti mostra l'elenco cliccabile
	
	if(numero_case < 2){
		
		var $casa = $(xml_case).find("home");
		var nome = $casa.find("nome").text();

		// Il tab casa è attivato e viene mostrato il div #tabCasa
    	$('#tab_casa').attr('class','active');
    	$('#tab_casa').html('<a href="#tabCasa" data-toggle="tab" style="border:1px solid #ffffff;"> '+nome+' </a>');
    	
    	//Ora si mostra a video la casa
    	mostraCasa(0);
	}
	else{
		var $casa = $(xml_case).find("home");
		
		//prendo la prima casa della lista e la metto come principale
		var nome = $casa.find("nome").eq(0).text();
		
		$('#tab_casa').attr('class','dropdown , active');
    	$('#tab_casa').html('<a href="#" class="dropdown-toggle" data-toggle="dropdown" id="tendina" onclick="menuTendina()" style="border:1px solid #ffffff;"> '+nome+' <span class="caret"></span></a>'+
    		'<ul id="casaType" class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu"></ul>');
    	
    	//per ogni elemento in più che trovo appendo le altre case
    	for(var i=0; i<numero_case ; i++){
    		nome_temp = $casa.find("nome").eq(i).text();
    		$('#casaType').append('<li><a tabindex="-1" href="javascript:mostraCasa('+i+');"> '+nome_temp+' </a></li>');
    	}
    	
    	mostraCasa(0);
	}
}

/*
 * Funzione che mostra a video tutte le info sulla casa selezionata
 */
function mostraCasa(i){
	
	/* Per sicurezza (se ci arrivo da tab altro) devo :
	*  - attivare la pagina tabCasa e disattivare il div tabAltro
	*  - il tasto tab_altro deve essere deselezionato e cliccabile  
	*  */	
	$('#tabAltro').attr('class','tab-pane');
	$('#tabCasa').attr('class','tab-pane active');
	
	//	$('#tab_casa').attr('class','active');
	$('#tab_altro').attr('class','');
	$('#tab_altro').html('<a onclick="goTabAltro(true)" data-toggle="tab" style="border:1px solid #ffffff;">Altro</a>');	

	var $casa = $(xml_case).find("home");
	var nome_mostrato = $casa.find("nome").eq(i).text();
	var indirizzo_mostrato = $casa.find("indirizzo").eq(i).text();
	var civ_mostrato = $casa.find("civ").eq(i).text();
	var cap_mostrato = $casa.find("cap").eq(i).text();
	var citta_mostrato = $casa.find("citta").eq(i).text(); 
	var provincia_mostrato = $casa.find("provincia").eq(i).text(); 
	sessionStorage.lat = $casa.find("latitudine").eq(i).text();
	sessionStorage.long = $casa.find("longitudine").eq(i).text();

	//Mostra la casa sulla mappa
	initialize_map("casa", sessionStorage.lat, sessionStorage.long);
	
	
	$('#Indirizzo_casa').attr('value',indirizzo_mostrato);
	$('#nCiv_casa').attr('value',civ_mostrato);
	$('#CAP_casa').attr('value',cap_mostrato);
	$('#Citta_casa').attr('value',citta_mostrato);
	$('#Provincia_casa').attr('value',provincia_mostrato);
	
}


/* 
 * Mostra la mappina con il poi
 */
function initialize_map(tipo, lat, long) {
	
	var latlng = new google.maps.LatLng(lat,long);

	// imposta le opzioni di visualizzazione
	var options = { zoom: 15,
			center: latlng,
	        mapTypeId: google.maps.MapTypeId.ROADMAP,
	        disableDefaultUI : true
	};
	              
	// crea l'oggetto mappa
	if(tipo == "casa"){
		var map = new google.maps.Map(document.getElementById('map_casa'), options);
	}
	else if(tipo == "altro"){
		var map = new google.maps.Map(document.getElementById('map_altro'), options);
	}
	
	  
	// inserisci il marker
	marker = new google.maps.Marker({ position: latlng,
		map: map, 
        title: 'Questo è un testo di suggerimento' });
}

/* 
 * Reverse Geocoding
 */

function codeLatLng(position_lat, position_long) {
	
	geocoder = new google.maps.Geocoder();

	  var lat = position_lat;
	  var lng = position_long;
	  var latlng = new google.maps.LatLng(lat, lng);
	  geocoder.geocode({'latLng': latlng}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
	    	
	    	for (var i=0;i<results[0].address_components.length ;i++)
	    	{ 	
	    		var val_street = results[0].address_components[i].types[0];
	    		
	    		switch (val_street){
	    			case "street_number":
	    				var nciv = results[0].address_components[i].long_name;
	    				break;
	    			case "route":
	    				var indirizzo = results[0].address_components[i].long_name;
	    				break;
	    			case "locality":
	    				var citta = results[0].address_components[i].long_name;
	    				break;
	    			case "administrative_area_level_2":
	    				var provincia = results[0].address_components[i].short_name;
	    				break;
	    			case "postal_code":
	    				var cap = results[0].address_components[i].long_name;
	    				break;
	    		}
	    	}

	    	//Inserisco i valori nel form
	    	$('#Indirizzo_altro').attr('value',indirizzo);
	    	$('#nCiv_altro').attr('value',nciv);
	    	$('#CAP_altro').attr('value',cap);
	    	$('#Citta_altro').attr('value',citta);
	    	$('#Provincia_altro').attr('value',provincia);
	    	
	    } else {
	      alert('Geocoder failed due to: ' + status);
	    }
	  });
	}

/*
 * Salva l'indirizzo attuale dell'utente nel database come luogo preferito
 */
function salvaIndirizzo(){

	nomeLuogo = $('#nome_luogo').val();
	nomeVia = $('#Indirizzo_altro').val();
	civico = $('#nCiv_altro').val();
	cap = $('#CAP_altro').val();
	comune = $('#Citta_altro').val();
	provincia = $('#Provincia_altro').val();
	
	if(nomeLuogo == ''){
		alert("Inserisi un nome per il luogo scelto.")
	}
	else{
		$('#loading').fadeIn('fast');		//schermata di caricamento
		//chiamata AJAX per salvare l'indirizzo nel database
		 $.ajax({
		          type: 'POST',
		          url: 'http://95.141.45.174/addaddress/',
		          contentType: 'application/x-www-form-urlencoded',
		          crossDomain: true,
		          data: {'nomevia': nomeVia, 
		        	  'numerocivico': civico, 
		        	  'cap': cap, 
		        	  'comune': comune, 
		        	  'provincia': provincia,
		        	  'latitudine': sessionStorage.lat,
		        	  'longitudine': sessionStorage.long,
		        	  'etichetta': nomeLuogo,
		        	  'isresidenza': true,
		        	  'isattivita': false,
		        	  'isdomicilio': false
		        	  },
		          complete: function(){$('#loading').fadeOut('fast')},		//nasconde la schermata di caricamento
		          success: ajaxIndirizzoSalvato(nomeLuogo),
		          //error: errorHandler  //ho tolto la function error così nn stampa gli alert
		          error: function(){}	
		});
	}
			 
}

function ajaxIndirizzoSalvato(nomeLuogo){
	alert("Indirizzo salvato come: "+nomeLuogo);
}

/*
 * Salva l'indirizzo, eventualmente modificato dall'utente, come una variabile storage e passa
 * alla scelta della modalità
 */
function scegli_modalita(luogo){
	
	if(luogo == "casa"){
		sessionStorage.complete_address = $('#Indirizzo_casa').val()+", "+$('#nCiv_casa').val()+", "+$('#CAP_casa').val()+", "+$('#Citta_casa').val()+", "+$('#Provincia_casa').val();	
		window.location='intervento-modalita.html'
	}
	else if(luogo == "altro"){
		sessionStorage.complete_address = $('#Indirizzo_altro').val()+", "+$('#nCiv_altro').val()+", "+$('#CAP_altro').val()+", "+$('#Citta_altro').val()+", "+$('#Provincia_altro').val();
		window.location='intervento-modalita.html'
	}
}

/*
 * Funzione per inviare la richiesta dell'urgenza
 */
function inviaUrgenza(luogo){
	$('#loading').fadeIn('fast');		//schermata di caricamento
	
	if(luogo == "casa"){
		sessionStorage.complete_address = $('#Indirizzo_casa').val()+", "+$('#nCiv_casa').val()+", "+$('#CAP_casa').val()+", "+$('#Citta_casa').val()+", "+$('#Provincia_casa').val();	
	}
	else if(luogo == "altro"){
		sessionStorage.complete_address = $('#Indirizzo_altro').val()+", "+$('#nCiv_altro').val()+", "+$('#CAP_altro').val()+", "+$('#Citta_altro').val()+", "+$('#Provincia_altro').val();
	}
	
	//alert(sessionStorage.problemTitle+" - "+sessionStorage.problemDesription+" - "+sessionStorage.problemType); 
	//alert(sessionStorage.problemImg+" - "+sessionStorage.lat+" - "+sessionStorage.long);
	
	$.ajax({
          type: 'POST',
          url: 'http://95.141.45.174/request/',
          contentType: 'application/x-www-form-urlencoded',
          crossDomain: true,
          data: {'titolo': sessionStorage.problemTitle, 
        	  'descrizione': sessionStorage.problemDesription, 
        	  'pathfoto': sessionStorage.problemImg, 
        	  'latitudine': sessionStorage.lat, 
        	  'longitudine': sessionStorage.long, 
        	  'isemergenza':  true, 
        	  'tiporichiestauno': sessionStorage.problemType, 
        	  'tiporichiestadue': 0,
        	  'tiporichiestatre': 0,
        	  'stato': 0
          },
          complete: function(){$('#loading').fadeOut('fast')},		//nasconde la schermata di caricamento
          success: ajaxEMERGENCY,
          error: errorHandler
       });
}

function funzioneMCE(){
	$.ajax({
		async: false,
		type: 'GET',
		url: 'http://95.141.45.174/mce/',			
		crossDomain:true,
		success: function(data){
			alert(data);
		},
		error: errorHandler
	});	
}

function ajaxEMERGENCY(data){
	window.location='intervento-invio.html';
}

/*
 * Funzioni chiamate al server
 * 
 * */

function login(){			//gestisce il login dell'utente
	$('#loading').fadeIn('fast');			//schermata di caricamento
	
	user =  $('#user').val(); 
	password =  $('#password').val(); 
	//alert(user);
	// il googlecod per ora è prova, ma in realtà verrà preso dalla 
	// registazione ad ogni avvio dell'app
	//sessionStorage.googlecod = "prova";

	$.ajax({
          type: 'POST',
          url: 'http://95.141.45.174/login/',
          contentType: 'application/x-www-form-urlencoded',
          crossDomain: true,
          data: {'userId': user, 'password': password, 'googlecod': sessionStorage.googlecod},
          complete: function(){$('#loading').fadeOut('fast')},		//nasconde la schermata di caricamento
          success: ajaxLOGIN,
          error: errorHandler
       });
}

/*
 * Login con Facebook
 */
function facebook_login(){
	$('#loading').fadeIn('fast');			//schermata di caricamento
	
	$.ajax({
        type: 'GET',
        url: 'http://95.141.45.174/login/facebook/',
        contentType: 'application/x-www-form-urlencoded',
        crossDomain: true,
        complete: function(){$('#loading').fadeOut('fast')},		//nasconde la schermata di caricamento
        success: ajaxLOGINFB,
        error: errorHandler
     })
	
}

function facebook_login_prova(){
	
	
	
}

//Registrazione utente
function user_signin(){
	$('#loading').fadeIn('fast');			//schermata di caricamento
	
	nome = $('#signU_name').val(); 
	cognome = $('#signU_surname').val(); 
	user =  $('#signU_user').val(); 
	password =  $('#signU_password2').val();
	mail =  $('#signU_mail').val();
	tipoUtente = "cliente";
	
	//alert("user: "+user+" Password: "+password+" email "+mail+" tipo utente: "+tipoUtente);
	
	 $.ajax({
	          type: 'POST',
	          url: 'http://95.141.45.174/register',
	          //contentType:"application/json",
	          //dataType:'jsonp',
	          //prova della schermata di attesa
	          contentType: 'application/x-www-form-urlencoded',
	          crossDomain: true,
	          data: {'userId': user, 'password': password, 'email': mail, 'tipoUtente': tipoUtente},
	          complete: function(){$('#loading').fadeOut('fast')},		//nasconde la schermata di caricamento
	          success: ajaxSIGNIN,
	          error: errorHandler
	})
}


//Completa la registrazione
function update_user_profile()
{
	/*user =  $('#signU_user').val(); 
	password =  $('#signU_password2').val();
	mail =  $('#signU_mail').val();
	tipoUtente = "cliente";
	
	//alert("user: "+user+" Password: "+password+" email "+mail+" tipo utente: "+tipoUtente);
	
	$.ajax({
	          type: 'POST',
	          url: 'http://95.141.45.174/register',
	          //contentType:"application/json",
	          //dataType:'jsonp',
	          contentType: 'application/x-www-form-urlencoded',
	          crossDomain: true,
	          data: {'userId': user, 'password': password, 'email': mail, 'tipoUtente': tipoUtente},
	          success: ajaxSIGNIN,
	          error: errorHandler
	})*/
	window.location='complete_signin_user2.html';
}


//Registrazione Professionista
function pro_signin()
{
	$('#loading').fadeIn('fast');			//schermata di caricamento
	
	user =  $('#signP_user').val(); 
	password =  $('#signP_password2').val();
	mail =  $('#signP_mail').val();
	tipoUtente = "professionista";
	
	$.ajax({
        type: 'POST',
        url: 'http://95.141.45.174/register',
        //contentType:"application/json",
        //dataType:'jsonp',
        contentType: 'application/x-www-form-urlencoded',
        crossDomain: true,
        data: {'userId': user, 'password': password, 'email': mail, 'tipoUtente': tipoUtente},
        complete: function(){$('#loading').fadeOut('fast')},		//nasconde la schermata di caricamento
        success: ajaxSIGNIN,
        error: errorHandler
	})
}

function provaNotifica(){
	$('#notifica').popover('toggle');
}

function cambiaBottone(testo){
	$('#bottone_via').html(testo+" <span class='caret'></span>"); 
	if (testo=="Viale"){
		$('#lista_vie').html("<li><a href='javascript:cambiaBottone(\"Via\");'>Via</a></li>" +
				"<li><a href='javascript:cambiaBottone(\"Largo\");'>Largo</a></li>" +
				"<li><a href='javascript:cambiaBottone(\"Piazza\");'>Piazza</a></li>" +
				"<li><a href='javascript:cambiaBottone(\"Piazzale\");'>Piazzale</a></li>"); 
	}
	else if(testo=="Largo"){
		$('#lista_vie').html("<li><a href='javascript:cambiaBottone(\"Via\");'>Via</a></li>" +
				"<li><a href='javascript:cambiaBottone(\"Viale\");'>Viale</a></li>" +
				"<li><a href='javascript:cambiaBottone(\"Piazza\");'>Piazza</a></li>" +
				"<li><a href='javascript:cambiaBottone(\"Piazzale\");'>Piazzale</a></li>"); 
	}
	else if(testo=="Piazza"){
		$('#lista_vie').html("<li><a href='javascript:cambiaBottone(\"Via\");'>Via</a></li>" +
				"<li><a href='javascript:cambiaBottone(\"Viale\");'>Viale</a></li>" +
				"<li><a href='javascript:cambiaBottone(\"Largo\");'>Largo</a></li>" +
				"<li><a href='javascript:cambiaBottone(\"Piazzale\");'>Piazzale</a></li>"); 
	}
	else if(testo=="Piazzale"){
		$('#lista_vie').html("<li><a href='javascript:cambiaBottone(\"Via\");'>Via</a></li>" +
				"<li><a href='javascript:cambiaBottone(\"Viale\");'>Viale</a></li>" +
				"<li><a href='javascript:cambiaBottone(\"Largo\");'>Largo</a></li>" +
				"<li><a href='javascript:cambiaBottone(\"Piazza\");'>Piazza</a></li>"); 
	}
	else if(testo=="Via"){
		$('#lista_vie').html("<li><a href='javascript:cambiaBottone(\"Viale\");'>Viale</a></li>" +
				"<li><a href='javascript:cambiaBottone(\"Largo\");'>Largo</a></li>" +
				"<li><a href='javascript:cambiaBottone(\"Piazza\");'>Piazza</a></li>" +
				"<li><a href='javascript:cambiaBottone(\"Piazzale\");'>Piazzale</a></li>"); 
	}
	
}

function ajaxLOGIN(data){
	//alert(data);
	if(data == "cliente"){	
		localStorage.userType = data;
		logged = true;
		localStorage.nickname = user;
		window.location='interventi-attivi.html';		
	}
	else if(data == "professionista"){
		localStorage.userType = data;
		logged = true;
		localStorage.nickname = user;
		window.location='interventi-attivi.html';	
	}
	else{
		alert("User o Password errati");
		//alert(data);
	}
}

function ajaxLOGINFB(data){
	//alert(data);
	if(data == ""){
		window.location='interventi-attivi.html';
	}
	else{
		alert("User o Password errati");
	}
}

function ajaxSIGNIN(data){
	if(tipoUtente=="cliente"){
		//alert("cliente registrato");
		window.location='complete_signin_user.html';
	}
	else if(tipoUtente=="professionista"){
		//alert("professionista registrato");
		window.location='complete_signin_pro.html';
	}
}

function errorHandler(xhr, textStatus, thrownError)		//gestione degli errori
{
   alert(xhr.status);
   alert(thrownError);
   //alert(textStatus);
   alert(xhr.responseText);
}

/* 
 * Funzione che cerca le coordinate GPS per la ricerca in zona
 */
function ricercaCoordinateInZona(filtroPrecedente, ordinamento){
	
	//Setto una variabile controller (per la funzione initiate_geolocation() e mi geolocalizzo)
	//alert("il filtro è: "+filtroPrecedente);
	sessionStorage.filtroPrecedente = filtroPrecedente;
	controller_geolocation = "ricercaInZona";
	initiate_geolocation();
}

/*
 * Una volta ottenute le coordinate faccio la ricerca in zona
 */
function ricercaInZona(filtroPrecedente, ordinamento) {
	$('#loading').fadeIn('fast');		//nasconde la schermata di caricamento
	
	//Disattivo il tasto tabAttivi e attivo il tasto tabIntorno
	$('#link_tabAttivi').attr('class','');
	$('#link_tabIntorno').attr('class','active');
	//Attivo la pagina tabIntorno e disattivo tabAttivi (la class alert alert-info è per lo sfondo)
	$('#tabAttivi').attr('class','tab-pane');
	$('#tabIntorno').attr('class','tab-pane active'); 
	$('#tabIntorno').html('');

	filtroIntervento = filtroPrecedente;
	orderType = ordinamento;
	
	//alert("proviamo le coordinate: "+sessionStorage.lat+" , "+sessionStorage.long);
	
	$.ajax({
			async: false,
			type: 'GET',
			//url: 'http://95.141.45.174/search?latitudine=44.499184&longitudine=11.353726',		
			url: 'http://95.141.45.174/search?latitudine='+sessionStorage.lat+'&longitudine='+sessionStorage.long,		
			crossDomain:true,
			complete: function(){$('#loading').fadeOut('fast')},		//nasconde la schermata di caricamento
			success: ricercaInZonaSuccess,
			error: errorHandler
			});	

	// Sovrascrittura valore di menuTendina() con la categoria 
	var categoria;
	if(typeof filtroIntervento === "undefined") {
		categoria = "Categoria";
	} else {
		categoria = filtroIntervento;
	}

	$('#tabIntorno').prepend(
		'<div class="btn-toolbar" style="margin: 0;">'+
				'<div class="btn-group" style="width:50%;display:inline:float:left;text-align:left;">'+
		                '<a class="btn dropdown-toggle btn-block btn-inverse btn-large" data-toggle="dropdown" href="#" id="tendina" onclick="menuTendina()">'+
		                  categoria + '&nbsp;'+
		                    '<span class="caret"></span>'+
		               '</a>'+
		                '<ul class="dropdown-menu btn-large" role="menu" aria-labelledby="dropdownMenu" id="dropCategorieConsumatore">'+
		                  '<li><a tabindex="-1" href="#">Tutti</a></li>'+
		                  '<li class="divider"></li>'+
		                  '<li><a tabindex="-1" href="#">Caldaista</a></li>'+
		                  '<li><a tabindex="-1" href="#">Idraulico</a></li>'+
		                  '<li><a tabindex="-1" href="#">Pittore</a></li>'+
		                  '<li><a tabindex="-1" href="#">Elettricista</a></li>'+
		                  '<li><a tabindex="-1" href="#">Muratore</a></li>'+
		                  '<li><a tabindex="-1" href="#">Antennista</a></li>'+
		                  '<li><a tabindex="-1" href="#">Sarto</a></li>'+
		                  '<li><a tabindex="-1" href="#">Calzolaio</a></li>'+
		                  '<li><a tabindex="-1" href="#">Meccanico</a></li>'+
		                  '<li><a tabindex="-1" href="#">Carpentiere</a></li>'+
		                  '<li><a tabindex="-1" href="#">Falegname</a></li>'+
		                '</ul>'+
	            '</div>'+
	            '<div style="display:inline;float:right;width:45%;text-align:right;">'+
	            '<a href="#" onclick="ricercaInZona(\''+filtroIntervento+'\',\'rating\')" class="btn btn-large btn-info" style="margin:0 2px 0 2px;"><i class="icon-star icon-white"></i></a>'+
	            '<a href="#" onclick="ricercaInZona(\''+filtroIntervento+'\',\'cost\')" class="btn btn-large btn-info"><i class="icon-shopping-cart icon-white"></i></a></div>'+
	    '</div>'+
	    '<div style="height:20px;"></div>');
	            
		$('.dropdown-menu li a').click(function() {
    		filtroIntervento = $(this).text();
    		ricercaInZona(filtroIntervento, "");
		});
	            
}

function ricercaInZonaSuccess(xml) {

	// Worker to array
	var xmlString = $(xml);
	var workerArrays = new Array();
	workerArrays = $(xmlString).find("worker");

	// Sorting per distanza
	var workerSortedByGeo = $(xml).find('worker').get().sort(function(a, b) {
     var valA = $(a).find('distance').text();
     var valB = $(b).find('distance').text();
     return valA < valB ? -1 : valA == valB ? 0 : 1;
    });
	// Sorting per prezzo per ora
	var workerSortedByCost = $(xml).find('worker').get().sort(function(a, b) {
     var valA = $(a).find('costPerHour').text();
     var valB = $(b).find('costPerHour').text();
     return valA < valB ? -1 : valA == valB ? 0 : 1;
    });
	// Sorting per rating
	var workerSortedByRating = $(xml).find('worker').get().sort(function(a, b) {
     var valA = $(a).find('rating').text();
     var valB = $(b).find('rating').text();
     return valA > valB ? -1 : valA == valB ? 0 : 1;
    });

	// Assegnazione per tipo di ordinamento
	if(orderType == 'cost') {
		// Ordinamento per costPerHours
		workerSorted = workerSortedByCost;
	} else if(orderType == 'rating') {
		// Ordinamento per rating
		workerSorted = workerSortedByRating;
	} else {
		// Ordinamento per distanza (default)
		workerSorted = workerSortedByGeo;
	}
	
	//var xmlString = $(xml);	
	$(workerSorted).each(function () {		
		var $worker = $(this);
		var nickname = $worker.find('nickname').text();
		var nome = $worker.find('nome').text();
		var cognome = $worker.find('cognome').text();
		var avatar = $worker.find('avatarPath').text();
		var ragione = $worker.find('ragioneSociale').text();
		var numInterventi = $worker.find('interventiFatti').text();
		var costService = $worker.find('costService').text();
		var costHour = $worker.find('costPerHour').text();
		var address = $worker.find('address').text();
		var rating = $worker.find('rating').text();
		var distance = $worker.find('distance').text();
        var lati = $worker.find('latitudine').text();
        var longi = $worker.find('longitude').text();
        var tag ="";
        $worker.find('professionType').each(function( index ) {
    		  tag = tag+$(this).text()+"\n";
    	});
        
        switch(Math.round(rating)) {
        case 0: rating =  stellaVuota + stellaVuota + stellaVuota + stellaVuota + stellaVuota + ' (0/5)'; break;
        case 1: rating =  stellaPiena + stellaVuota + stellaVuota + stellaVuota + stellaVuota + ' (1/5)'; break;
        case 2: rating =  stellaPiena + stellaPiena + stellaVuota + stellaVuota + stellaVuota + ' (2/5)'; break;
        case 3: rating =  stellaPiena + stellaPiena + stellaPiena + stellaVuota + stellaVuota + ' (3/5)'; break;
        case 4: rating =  stellaPiena + stellaPiena + stellaPiena + stellaPiena + stellaVuota + ' (4/5)'; break;
        case 5: rating =  stellaPiena + stellaPiena + stellaPiena + stellaPiena + stellaPiena + ' (5/5)'; break;
        }
        
        var pagina = "javascript:profiloPro('"+nickname+"');";
        	
        if((typeof filtroIntervento === "undefined") || tag.indexOf(filtroIntervento) != -1 || filtroIntervento == 'Tutti') {
	        $('#tabIntorno').append('<button class="btn btn-block text-center" onclick="'+pagina+'"><div style="width:70%; float:left;">'+
	        		'<p><b>'+nome+' '+cognome+'</b></p>'+
	        		'<p style="font-size:0.8em; margin-top:-10px;"><span style="text-transform:uppercase">'+tag+'</span></p>'+
	        		'<p style="margin-top:-10px;">'+rating+'</i></p>'+
	        		'<p style="font-size:0.8em; margin-top:-10px; margin-bottom:-5px;">'+distance+'</p></div>'+
	        		'<div style="width:30%; float:right; line-height:260%;">'+
	        		'<div style="border:2px solid black; width:80%;"><i class="icon-headphones"></i> '+costService+' €<br/>'+
	        		'<i class="icon-shopping-cart"></i> '+costHour+' €/h</div>'+
	        		'</div></button>');  
	    } 

	        
	});
} 

function ricercaAttivi() { //funzione per tirare giu gli interventi attivi
	
	
	if(localStorage.notificaSalvata == ""){
		alert("no notifica");
	}
	else{
		//elaboraNotifica(e.payload);
		alert("si notifica");
	}
	
	//Attivo il tasto tabAttivi e disattivo il tasto tabIntorno
	$('#link_tabAttivi').attr('class','active');
	$('#link_tabIntorno').attr('class','');
	
	if(localStorage.userType == "cliente"){
		$.ajax({
			async: false,
			type: 'GET',
			url: 'http://95.141.45.174/openjob',			
			crossDomain:true,
			complete: function(){$('#loading').fadeOut('fast')},
			success: ricercaAttiviSuccess,
			error: errorHandler
			});	
	}
	else if(localStorage.userType == "professionista"){
		$.ajax({
			async: false,
			type: 'GET',
			url: 'http://95.141.45.174/listjobs',			
			crossDomain:true,
			complete: function(){$('#loading').fadeOut('fast')},
			success: ricercaAttiviSuccess,
			error: errorHandler
			});	
	} 	

}


function ricercaAttiviSuccess(xml){

	$('#tabAttivi').html("");
	var xmlString = $(xml);	
	// cerco se ci sono interventi attivi
	if($(xmlString).find("request").length > 0){
		//Attivo la pagina tabAttivi e disattivo tabIntorno
		$('#tabAttivi').attr('class','tab-pane active');
		$('#tabIntorno').attr('class','tab-pane');
		//Attivo il tasto tabAttivi e disattivo il tasto tabIntorno
		$('#link_tabAttivi').attr('class','active');
		$('#link_tabIntorno').attr('class','');

		//cerco all'interno dell'xml tutti gli interventi attivi e gli appendo
		$(xmlString).find("request").each(function (){
			var $request = $(this);
			var id = $request.find("id").text();
			var date = $request.find("date").text();
			var description = $request.find("description").text();
			var state = $request.find("state").text();
			var picture = $request.find("picture").text(); //path della foto
			var title = $request.find("title").text(); 


			// IMMAGINE NOTFOUND?
			 if (picture == 'Photo' || picture == 'photo' || picture == '') {
        		picture = './img/missingAvatar.png';
      		} else {
        		picture = picture;
     		}

     		// Ricavo lo stato in stringa
     		state_string = '';

     		switch(state){
				case "0":   state_string = "default"; 
							state_string_it = "La richiesta &egrave; stata inviata. Attendi che il professionista risponda.";
						    //state_bar = "width:10%;";
						    state_bar = "width:30%;";
						    state_active = "active";
						    progress_state = "progress-info";
							break;
				case "1":   state_string = "research_request_init"; 
							state_string_it = "Richiesta inviata ai professionisti in zona";
							//state_bar = "width:10%;";
						    state_bar = "width:30%;";
							state_active = "active";
							progress_state = "progress-info";
							break;
				case "2":   state_string = "research_professionist_rejected"; 
							state_string_it = "Il professionista ha rifiutato l'intervento";
							state_bar = "width:100%;";
							state_active = "";
							progress_state = "progress-danger";
							break;
				case "3":   state_string = "research_professionist_accepted"; 
							state_string_it = "Il professionista ha accettato la richiesta, guarda il suo preventivo";
							//state_bar = "width:40%;";
							state_bar = "width:100%;";
							state_active = "active";
							progress_state = "progress-info";
							break;
				case "4":   state_string = "research_work_annulled"; 
							state_string_it = "La richiesta &egrave; stata annullata";
							state_bar = "width:100%;";
							state_active = "";
							progress_state = "progress-danger";
							break;
				case "5":   state_string = "research_payment_sent"; 
							state_string_it = "Il pagamento &egrave; stato inviato";
							state_bar = "width:70%;";
							state_active = "active";
							progress_state = "progress-info";
							break;
				case "6":   state_string = "research_feedback_saved";
							state_string_it = "Il feedback &egrave; stato inviato";
							state_bar = "width:90%;";
							state_active = "active";
							progress_state = "progress-info"; 
							break;
				case "7":   state_string = "research_hidden"; 
							state_string_it = "Hidden";
							state_bar = "width:100%;";
							state_active = "";
							progress_state = "progress-danger";
							break;
				case "8":   state_string = "research_consumer_annulled"; 
							state_string_it = "Intervento annullato dal consumatore";
							state_bar = "width:100%;";
							state_active = "";
							progress_state = "progress-danger";
							break;
				case "9":   state_string = "research_staff_closed"; 
							state_string_it = "Intervento annullato dallo staff di LocalJob";
							state_bar = "width:100%;";
							state_active = "";
							progress_state = "progress-danger";
							break;
				case "10":  state_string = "research_payment_rejected";
							state_string_it = "Il pagamento &egrave; stato rifiutato";
							state_bar = "width:40%;"; 
							state_active = "active";
							progress_state = "progress-warning";
							break;
				case "11":  state_string = "research_refounded"; 
							state_string_it = "Pagamento rimborsato";
							state_bar = "width:40%;";
							state_active = "active";
							progress_state = "progress-warning";
							break;
				case "12":  state_string = "research_sys_locked"; 
							state_string_it = "Sys Locked";
							state_bar = "width:100%;";
							state_active = "";
							progress_state = "progress-danger";
							break;
				case "13":  state_string = "emergency_request_init"; 
							state_string_it = "Richiesta di intervento con urgenza trasmesso ai professionisti";
							state_bar = "width:10%;";
							state_active = "active";
							progress_state = "progress-info";
							break;
				case "14":  state_string = "research_work_finished"; 
							state_string_it = "Il lavoro &egrave; stato terminato con successo";
							state_bar = "width:100%;";
							state_active = "";
							progress_state = "progress-success";
							break;
				case "15":  state_string = "research_feedback_needed"; 
							state_string_it = "Il feedback non &egrave; ancora stato rilasciato";
							state_bar = "width:70%;";
							state_active = "active";
							progress_state = "progress-warning";
							break;
			}

     		var pagina = "javascript:interventoCli('"+id+"');";
     		
			$('#tabAttivi').append('<a class="btn btn-block text-center" href="'+pagina+'" style="padding:2%;">'+
                            '<div class="row-fluid">'+	
                      			'<div class="span12">'+
                        			'<div class="progress ' + progress_state + ' progress-striped ' + state_active + '" style="margin-bottom:0;">'+
                          				'<div class="bar" style="'+state_bar+'"></div>'+
                        			'</div></div></div>'+
                   			'<div class="row-fluid">'+
               					'<div style="width:30%; float:left;">'+
               						'<img src="http://95.141.45.174/'+picture+'" style="width:70%; margin-left:15%;" class="img-polaroid">'+
               					'</div>'+
	               				'<div style="width:100%; margin-top:-10px;">'+
	               					'<h6 style="text-transform:uppercase; text-align:left; margin-bottom:0;">'+title+'</h6>'+
	               					'<p style="text-align:left; margin-right:8%; font-size:0.8em; height:15px; overflow:hidden;">'+description+'</p>'+
	               					'<p style="text-align:left; margin-right:8%; font-size:0.8em; height:15px; overflow:hidden;">'+ '<b>Iniziato il: </b>' + date+'</p>'+
	               					'<p style="text-align:left; margin-right:8%; font-size:0.8em; height:65px; overflow:hidden;">'+ '<b>Stato intervento: </b>' +state_string_it+'</p>'+

	               				'</div></div></a>');
		
		});
	}

	//se non ci sono interventi attivi vai su ricerca in zona
	else{
		$('#tabAttivi').html("<p>Non hai interventi attivi per il momento.</p>");
		//ricercaInZona("Tutti","");
		ricercaCoordinateInZona('Tutti','');
	}
}

function interventoCli(id){
	sessionStorage.id = id;
	window.location='storicoCliente.html';
}

//chiamata all'interno di "storicoCliente" che mostra i dati di un intervento attivo cliccato su "interventi-attivi"
function mostraStoricoCli(id){
	$('#loading').fadeIn('fast');		//mostra schermata di caricamento
	
	$.ajax({
		async: false,
		type: 'GET',
		url: 'http://95.141.45.174/getinfojob/'+id+'/',
		crossDomain:true,
		complete: function(){$('#loading').fadeOut('fast')},		//nasconde schermata di caricamento
		success: mostraStoricoCliSuccess,
		error: errorHandler,
		});	
}

function mostraStoricoCliSuccess(xml){
	var $request = $(xml);	
	var id = $request.find("id").text();
	var date = $request.find("data").text();
	var descrizione = $request.find("descrizione").text();
	var state = $request.find("stato").text();
	var foto = $request.find("foto").text(); //path della foto
	var titolo = $request.find("titolo").text();
	//var codiceCliente = $request.find("codiceCliente").text();

	// IMMAGINE NOTFOUND?
	 if (foto == 'Photo' || foto == 'photo' || foto == '') {
		foto = './img/missingAvatar.png';
	 }
	 else {
		foto = foto;
	 }

	// Ricavo lo stato in stringa
		state_string = '';

		switch(state){
			case "0":   state_string = "default"; 
						state_string_it = "La richiesta &egrave; stata inviata. Attendi che il professionista risponda.";
						//state_bar = "width:10%;";
						state_bar = "width:30%;";
						state_active = "active";
						progress_state = "progress-info";
						break;
			case "1":   state_string = "research_request_init"; 
						state_string_it = "Richiesta inviata al professionista";
						//state_bar = "width:10%;";
						state_bar = "width:30%;";
						state_active = "active";
						progress_state = "progress-info";
						break;
			case "2":   state_string = "research_professionist_rejected"; 
						state_string_it = "Il professionista ha rifiutato l'intervento";
						state_bar = "width:100%;";
						state_active = "";
						progress_state = "progress-danger";
						break;
			case "3":   state_string = "research_professionist_accepted"; 
						state_string_it = "Il professionista ha accettato l'intervento";
						//state_bar = "width:40%;";
						state_bar = "width:100%;";
						state_active = "active";
						progress_state = "progress-info";
						break;
			case "4":   state_string = "research_work_annulled"; 
						state_string_it = "La richiesta &egrave; stata annullata";
						state_bar = "width:100%;";
						state_active = "";
						progress_state = "progress-danger";
						break;
			case "5":   state_string = "research_payment_sent"; 
						state_string_it = "Il pagamento &egrave; stato inviato";
						state_bar = "width:70%;";
						state_active = "active";
						progress_state = "progress-info";
						break;
			case "6":   state_string = "research_feedback_saved";
						state_string_it = "Il feedback &egrave; stato inviato";
						state_bar = "width:90%;";
						state_active = "active";
						progress_state = "progress-info"; 
						break;
			case "7":   state_string = "research_hidden"; 
						state_string_it = "Hidden";
						state_bar = "width:100%;";
						state_active = "";
						progress_state = "progress-danger";
						break;
			case "8":   state_string = "research_consumer_annulled"; 
						state_string_it = "Intervento annullato dal consumatore";
						state_bar = "width:100%;";
						state_active = "";
						progress_state = "progress-danger";
						break;
			case "9":   state_string = "research_staff_closed"; 
						state_string_it = "Intervento annullato dallo staff di LocalJob";
						state_bar = "width:100%;";
						state_active = "";
						progress_state = "progress-danger";
						break;
			case "10":  state_string = "research_payment_rejected";
						state_string_it = "Il pagamento &egrave; stato rifiutato";
						state_bar = "width:40%;"; 
						state_active = "active";
						progress_state = "progress-warning";
						break;
			case "11":  state_string = "research_refounded"; 
						state_string_it = "Pagamento rimborsato";
						state_bar = "width:40%;";
						state_active = "active";
						progress_state = "progress-warning";
						break;
			case "12":  state_string = "research_sys_locked"; 
						state_string_it = "Sys Locked";
						state_bar = "width:100%;";
						state_active = "";
						progress_state = "progress-danger";
						break;
			case "13":  state_string = "emergency_request_init"; 
						state_string_it = "Richiesta di intervento con urgenza trasmesso ai professionisti";
						state_bar = "width:10%;";
						state_active = "active";
						progress_state = "progress-info";
						break;
			case "14":  state_string = "research_work_finished"; 
						state_string_it = "Il lavoro &egrave; stato terminato con successo";
						state_bar = "width:100%;";
						state_active = "";
						progress_state = "progress-success";
						break;
			case "15":  state_string = "research_feedback_needed"; 
						state_string_it = "Il feedback non &egrave; ancora stato rilasciato";
						state_bar = "width:70%;";
						state_active = "active";
						progress_state = "progress-warning";
						break;
		}

	var pagina = "javascript:interventoCli('"+id+"');";
		
	$('#incolla').html('<div class="row-fluid">'+	
              			'<div class="span12">'+
                			'<div class="progress ' + progress_state + ' progress-striped ' + state_active + '" style="margin-bottom:0;">'+
                  				'<div class="bar" style="'+state_bar+'"></div>'+
                			'</div></div></div>'+
                			'<div class="row-fluid">'+
        					'<h4 id="titoloPagina">Ecco i dettagli del lavoro:</h4>'+
        					'<p><b>ID INTERVENTO:</b> '+id+'<br/><b>DATA:</b> '+date+'</p>'+
        					'<a href="javascript:mostraPanelFoto()"><img id="foto" src="http://95.141.45.174/'+foto+'" style="width:100px;"/></a><br/>'+
        					'Tappa sulla foto per ingrandirla'+
        		    		'<div id="descrizione"><h5 id="titoloIntervento" style="text-transform:uppercase;">'+titolo+'</h5><p id="descrizione2">'+descrizione+'</p></div>');
	$('#fotoGrande').attr('src', 'http://95.141.45.174/'+foto);
	
	//il bottone di inserisci commento
	if(state==3){
		$('#incolla').append('<button class="btn btn-large btn-block btn-success" href="commento-nuovo.html">LASCIA UN COMMENTO</button><br/>');
	}
	//il bottone di default
	$('#incolla').append('<button class="btn btn-large btn-block btn-inverse" onclick="javascript:history.go(-1);"">TORNA INDIETRO</button></div>');
}

/**/

//chiamata che mostra gli interventi attivi del professionista in "interventi-attivi"
function ricercaAttiviProfessionista() { 
	$('#loading').fadeIn('fast');		//schermata di caricamento
	
	$.ajax({
		async: false,
		type: 'GET',
		url: 'http://95.141.45.174/listjobs',			
		crossDomain:true,
		complete: function(){$('#loading').fadeOut('fast')},
		success: ricercaAttiviProfessionistaSuccess ,
		error: errorHandler ,
		});	
}


function ricercaAttiviProfessionistaSuccess(xml){
	$('#tabAttivi').html("");

	var xmlString = $(xml);	

	if($(xmlString).find("request")){		
		//Attivo la pagina tabAttivi e disattivo tabIntorno
		$('#tabAttivi').attr('class','tab-pane active');
		$('#tabIntorno').attr('class','tab-pane');

		//cerco all'interno dell'xml tutti gli interventi attivi e gli appendo
		$(xmlString).find("request").each(function (){
			var $request = $(this);
			var id = $request.find("id").text();
			var date = $request.find("date").text();
			var description = $request.find("description").text();
			var state = $request.find("state").text();
			var picture = $request.find("picture").text(); //path della foto
			var title = $request.find("title").text(); 


			switch(state){

				case "0": state_bar = "width:10%;"; break;
				case "1": state_bar = "width:20%;"; break;
				case "2": state_bar = "width:40%;"; break;
				case "3": state_bar = "width:40%;"; break;
				case "4": state_bar = "width:40%;"; break;
				case "5": state_bar = "width:60%;"; break;
				case "6": state_bar = "width:60%;"; break;
				case "7": state_bar = "width:60%;"; break;
				case "8": state_bar = "width:60%;"; break;
				case "9": state_bar = "width:60%;"; break;
				case "10": state_bar = "width:60%;"; break;
				case "11": state_bar = "width:80%;"; break;
				case "12": state_bar = "width:80%;"; break;
				case "13": state_bar = "width:80%;"; break;
				case "14": state_bar = "width:90%;"; break;
				case "15": state_bar = "width:90%;"; break;

			}

			$('#tabAttivi').append('<button class="btn btn-block text-center" style="padding:2%;">'+
                            '<div class="row-fluid">'+	
                      			'<div class="span12">'+
                        			'<div class="progress progress-info progress-striped active" style="margin-bottom:0;">'+
                          				'<div class="bar" style="'+state_bar+'"></div>'+
                        			'</div></div></div>'+
                   			'<div class="row-fluid">'+
               					'<div style="width:30%; float:left;">'+
               						'<img src="'+picture+'" style="width:70%; margin-left:15%;" class="img-polaroid">'+
               					'</div>'+
	               				'<div style="width:65%; float:right; margin-top:-10px;">'+
	               					+date+
	               					'<h6 style="text-transform:uppercase; margin-bottom:0;">'+title+'</h6>'+
	               					'<p style="text-align:justify; margin-right:8%; font-size:0.8em; height:65px; overflow:hidden;">'+description+'</p>'+
	               				'</div></div></button>');

		});
				

	}

	//se non ci sono interventi attivi vai su ricerca in zona
	else{
		$('#tabAttivi').append('<div class="alert alert-info"> Non ci sono interventi attivi. </div>');
	}

}


/* Funzione per il menu a tendina per mostrare sul bottone l'elemento selezionato */

function menuTendina(){
	$(".dropdown-menu li a").click(function(){
    
    $("#tendina:first-child").html($(this).text()+ ' <span class="caret"></span>');
    $("#tendina:first-child").val($(this).text());
  });


}

function exitFromApp(buttonIndex) {
   if (buttonIndex==1){
   	
    navigator.app.exitApp();

	}
}

function confermaUscita()
       {

       		navigator.notification.confirm(
       		'Vuoi davvero chiudere la app?',  
        	exitFromApp,            
        	'Uscita',            
        	'OK,Annulla');

       }