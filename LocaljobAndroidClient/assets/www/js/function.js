var tipoUtente;
var position_lat;
var position_long;

var geocoder;
var marker;

//var googlecod;

//var googlecod;
//var pushNotification;

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
			console.log("regID = " + e.regID);
			sessionStorage.googlecod = e.regid;
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
        	
			alert('Hai scritto: ' + e.payload.message);
			
			//DA QUA GESTISCO I TIPI DI NOTIFICHE
			if(e.payload.notificationType == "request") {
				
			}
			
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
 * Orientation Changer
 */
 function orientationChange(e) {
   var orientation="portrait";
   if(window.orientation == -90 || window.orientation == 90) orientation = "landscape";

   if (orientation="portrait"){
      alert("Sono in portrait!");
   }
   else
   	  alert("Sono in landscape!");
}


/*
 * Funzioni per cambi dinamici pagine
 *  
 * */

function cambia_login(){
	$('#logone').html('<div class="navbar navbar-inverse navbar-fixed-top" style="height:10%; padding-bottom:25%;">'+
	    	'<div class="navbar-inner text-left">'+     
		    '<div class=" btn-group" style="margin:0.7%">'+
		    '<button class="btn btn-large btn-inverse" type="button" onclick="javascript:window.location.reload()">'+
		    '<img src="./img/glyphicons/white_ver/225.PNG" style="height:22px;">'+
	      	'</button>'+
	      	'<button class="btn btn-large btn-primary" type="button" style="line-height:22px;">'+
	      	'<img src=./img/logo-white-inline-all.png style="height:22px" /></button>'+        		
	        '</div></div></div>');	
	
	$('#contenitore').html("<h4>Accedi a LocalJob</h4><form class='form-signin' action='javascript:login();'>" +
			"<input id='user' type='text' class='input-block-level' placeholder='Username'>" +
			"<input id='password' type='password' class='input-block-level' placeholder='Password'>" +
			"<div align='center'><button class='btn btn-large btn-block btn-inverse' type='submit'>Accedi</button></div>" +
			"<div align='center' id='password_link'><a href='#'>Hai dimenticato la password?</a></div></form>");
}


/*
 * Funzione che salva tutti i dati del problema, e rimanda alla pagina dove ti geolocalizza
 * 
 * */
function saveProblem(){
	problemTitle =  $('#problemTitle').val(); 
	//problemType =  $('#problemType').val(); 
	problemDesription =  $('#problemDesription').val(); 

	//Salvo i valori nel sessionStorage
	sessionStorage.problemTitle = problemTitle;
	//sessionStorage.problemType = problemType;
	sessionStorage.problemDesription = problemDesription;
	
	window.location='where-are-you.html';	
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
	indirizzo = true;
	
	//se non ha indirizzo vai sul tab altro, lo geolocalizzi, ti trova lat e long
	//e ti inserisce l'indirizzo nel form (da fare)
	if (indirizzo == false){
		goTabAltro(indirizzo);	
	}
	//se ha l'indirizzo vai sul tab casa, prende dal database tutte le info
	//e le mostra nel form 
	else{
		goTabCasa(indirizzo);
		
	}
	
}

function goTabAltro(indirizzo){
	
	//Funzione che manda al tab altro (quindi con geolocalizzazione)
	
	//Fai prima un controllo...se non ha indirizzi predefiniti...non ha la 
	//possibilità di cliccare nel tab casa ... altrimenti si
		
		if (indirizzo == false){	
    		alert("non ha indirizzo casa");
    		//Il tab casa deve essere disabilitato e non ci si può cliccare nulla
    		$('#tab_casa').attr('class','disabled');
    		$('#tab_casa').html('<a>Casa</a>');
		}
		else{
			
			$('#tab_casa').attr('class','');
			$('#tab_casa').html('<a onclick="goTabCasa(true);" data-toggle="tab" style="border:1px solid #ffffff;">Casa</a>');
		}
		//Il tab altro è attivato e viene mostrato il div #tabAltro
		$('#tab_altro').attr('class','active');
		$('#tab_altro').html('<a href="#tabAltro" data-toggle="tab">Altro</a>');
		
		//Attivo la pagina tabAltro e disattivo tabCasa
		$('#tabAltro').attr('class','tab-pane active');
		$('#tabCasa').attr('class','tab-pane');
		
		
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
	
	initialize_map("altro", position_lat, position_long);
	
	//una volta che mi darà la posizione corrente, dalle google API trovo indirizzo ecc
	codeLatLng(position_lat, position_long);

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


function goTabCasa(indirizzo){
	//Funzione che manda al tab casa (quindi senza geolocalizzazione)
	alert("ha indirizzo");
	
	//alert("Questa è una prova: "+sessionStorage.problemTitle+" "+sessionStorage.problemType+" "+sessionStorage.problemDesription);
	
	
	//Tira giù i dati della casa dal DB
	//Poi fai un controllo...se ha più indirizzi salvati...se ne ha 1 
	//visualizzi il tab normale senò quello con più opzioni
	
	numero_case = 1; //il numero di case viene richiesto dal server

	//Fa un controllo, se c'è solo una casa mostra il tab normale, altrimenti mostra
	//l'elenco
	if(numero_case < 2){
		//Il tab casa è attivato e viene mostrato il div #tabCasa
    	$('#tab_casa').attr('class','active');
    	$('#tab_casa').html('<a href="#tabCasa" data-toggle="tab" style="border:1px solid #ffffff;">Casa</a>');	
	}
	else{
		$('#tab_casa').attr('class','dropdown');
    	$('#tab_casa').html('<a href="#tabCasa" class="dropdown-toggle" data-toggle="dropdown" style="border:1px solid #ffffff;">Casa <b class="caret"></b></a>'+
    		'<ul class="dropdown-menu">'+
    		'<li>Casa Mare</li>'+
    		'<li>Ufficio</li>'+
    		'</ul>');	
	}
		
	//Il tab altro è cliccabile e viene mostrato il div #tabAltro
	$('#tab_altro').attr('class','');
	$('#tab_altro').html('<a onclick="goTabAltro(true)" data-toggle="tab" style="border:1px solid #ffffff;">Altro</a>');
	
	//Attivo la pagina tabCasa e disattivo tabAltro
	$('#tabAltro').attr('class','tab-pane');
	$('#tabCasa').attr('class','tab-pane active');

	//faccio chiamata al database e mi darà tutti i dati della casa
	//dati di prova, questi servono solo per la visualizzazione
	indirizzo ="Via Camillo Ranzani";
	nciv="11";
	cap="40127";
	citta="Bologna";
	provincia="BO";
	//questi servono per la chiamata al server
	sessionStorage.lat="44.500821";
	sessionStorage.long="11.35878";
	//
	
	//Mostra la casa sulla mappa
	initialize_map("casa", sessionStorage.lat, sessionStorage.long);
	
	
	$('#Indirizzo_casa').attr('value',indirizzo);
	$('#nCiv_casa').attr('value',nciv);
	$('#CAP_casa').attr('value',cap);
	$('#Citta_casa').attr('value',citta);
	$('#Provincia_casa').attr('value',provincia);
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
function inviaUrgenza(){
	
	alert("Problem Type: "+sessionStorage.problemTitle+" \n " +
			"Request Type: "+sessionStorage.problemType+" \n " +
			"Description: "+sessionStorage.problemDesription+" \n"+
			"Lat e Long: "+sessionStorage.lat+" , "+sessionStorage.long+" \n"+
			"Indirizzo completo: "+sessionStorage.complete_address);
	
	/*
	$.ajax({
          type: 'POST',
          url: 'http://95.141.45.174/request/emergency',
          ajaxStart: function(){
        	  window.location='wait.html';
          },
          contentType: 'application/x-www-form-urlencoded',
          crossDomain: true,
          data: {'problemType': sessionStorage.problemTitle, 'requestType': sessionStorage.problemType, 'description': sessionStorage.problemDesription, 'latitude': sessionStorage.lat, 'longitude': sessionStorage.long},
          success: ajaxEMERGENCY,
          error: errorHandler
       })
       */
}


/*
 * Funzione ricerca standard
 */
function ricercaStandard(){
	
	//da verificare bene questa cosa...il server non è pronto?
	//window.location='risultatoRicercaStandard.html';
	
	alert("Problem Type: "+sessionStorage.problemTitle+" \n " +
			"Request Type: "+sessionStorage.problemType+" \n " +
			"Description: "+sessionStorage.problemDesription+" \n"+
			"Lat e Long: "+sessionStorage.lat+" , "+sessionStorage.long+" \n"+
			"Indirizzo completo: "+sessionStorage.complete_address);
	
	$.ajax({
			async: false,
			type: 'GET',
			url: 'http://95.141.45.174/search?latitudine='+sessionStorage.lat+'&longitudine='+sessionStorage.lat+'&job='+sessionStorage.problemType+'',			
			crossDomain:true,
			complete: function(){$('#loading').fadeOut('fast')},		//nasconde la schermata di caricamento
			success: ricercaStandardSuccess,
			error: errorHandler
			});	
}

function ricercaStandardSuccess(xml) {
	
	var xmlString = $(xml);	
	$(xmlString).find("worker").each(function () {		
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
        
        out = "Nick: "+nickname+" Nome: "+nome+" Cognome: "+cognome+" distanza: "+distance+" rating: "+rating;
        alert("prova :"+out);
        
        //indirizzo pagina professionista - andrà aggiornato in qualche modo
        //var pagina = "javascript:window.location='profilo-professionista.html'"
        var pagina = "javascript:profiloPro('"+nickname+"');";
        	
        $('#tabRicercaStandard').append('<button class="btn btn-block text-center" onclick="'+pagina+'"><div style="width:70%; float:left;">'+
        		'<p><b>'+nome+' '+cognome+'</b></p>'+
        		'<p style="font-size:0.8em; margin-top:-10px;"><span style="text-transform:uppercase">'+tag+'</span></p>'+
        		'<p style="margin-top:-10px;"><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i></p>'+
        		'<p style="font-size:0.8em; margin-top:-10px; margin-bottom:-5px;">A 15 km da te</p></div>'+
        		'<div style="width:30%; float:right; line-height:260%;">'+
        		'<div style="border:2px solid black; width:80%;"><i class="icon-headphones"></i> '+costService+' €<br/>'+
        		'<i class="icon-shopping-cart"></i> '+costHour+' €/h</div>'+
        		'</div></button>');  
        
	});
} 


/*
 * Funzioni chiamate al server
 * 
 * */

function login()	//gestisce il login dell'utente
{	
	$('#loading').fadeIn('fast');			//schermata di caricamento
	
	//alert(sessionStorage.googlecod);
	user =  $('#user').val(); 
	password =  $('#password').val(); 
	// il googlecod per ora è prova, ma in realtà verrà preso dalla 
	// registazione ad ogni avvio dell'app
	//sessionStorage.googlecod = "prova";

	$.ajax({
          type: 'POST',
          url: 'http://95.141.45.174/login/',
          //contentType:"application/json",
          //dataType:'jsonp',
          //prova della schermata di attesa
          ajaxStart: function(){
        	  window.location='wait.html';
          },
          contentType: 'application/x-www-form-urlencoded',
          crossDomain: true,
          data: {'userId': user, 'password': password, 'googlecod': sessionStorage.googlecod},
          complete: function(){$('#loading').fadeOut('fast')},		//nasconde la schermata di caricamento
          success: ajaxLOGIN,
          error: errorHandler
       })
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
function user_signin()
{
	$('#loading').fadeIn('fast');			//schermata di caricamento
	nome = $('#signU_name').val(); 
	cognome = $('#signU_surname').val(); 
	//
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
	if(data == ""){
		window.location='interventi-attivi.html';
	}
	else{
		alert("User o Password errati");
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
}





// Parte di richi
function ricercaInZona() {
	$('#loading').fadeIn('fast');		//nasconde la schermata di caricamento
	
	//Attivo la pagina tabIntorno e disattivo tabAttivi (la class alert alert-info è per lo sfondo)
	$('#tabAttivi').attr('class','tab-pane');
	$('#tabIntorno').attr('class','tab-pane active'); 
	$('#tabIntorno').html('');
	
	$.ajax({
			async: false,
			type: 'GET',
			url: 'http://95.141.45.174/search?latitudine=44.499184&longitudine=11.353726',			
			crossDomain:true,
			complete: function(){$('#loading').fadeOut('fast')},		//nasconde la schermata di caricamento
			success: ricercaInZonaSuccess,
			error: errorHandler
			});	
}

function ricercaInZonaSuccess(xml) {
	
	var xmlString = $(xml);	
	$(xmlString).find("worker").each(function () {		
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
        
        //out = "Nick: "+nickname+" Nome: "+nome+" Cognome: "+cognome+" distanza: "+distance+" rating: "+rating;
        //alert(out);
        
        //indirizzo pagina professionista - andrà aggiornato in qualche modo
        //var pagina = "javascript:window.location='profilo-professionista.html'"
        var pagina = "javascript:profiloPro('"+nickname+"');";
        	
        $('#tabIntorno').append('<button class="btn btn-block text-center" onclick="'+pagina+'"><div style="width:70%; float:left;">'+
        		'<p><b>'+nome+' '+cognome+'</b></p>'+
        		'<p style="font-size:0.8em; margin-top:-10px;"><span style="text-transform:uppercase">'+tag+'</span></p>'+
        		'<p style="margin-top:-10px;"><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star"></i><i class="icon-star-empty"></i><i class="icon-star-empty"></i></p>'+
        		'<p style="font-size:0.8em; margin-top:-10px; margin-bottom:-5px;">A 15 km da te</p></div>'+
        		'<div style="width:30%; float:right; line-height:260%;">'+
        		'<div style="border:2px solid black; width:80%;"><i class="icon-headphones"></i> '+costService+' €<br/>'+
        		'<i class="icon-shopping-cart"></i> '+costHour+' €/h</div>'+
        		'</div></button>');  
        
	});
} 

function ricercaAttivi() { //funzione per tirare giu gli interventi attivi
	
	//$('#loading').fadeIn('fast');		//schermata di caricamento
	

	//$('#tabIntorno').append('<div id="attivi" class="alert alert-info"> <!-- sfondo -->');

	$.ajax({
		async: false,
		type: 'GET',
		url: 'http://95.141.45.174/openjob',			
		crossDomain:true,
		complete: function(){$('#loading').hide()},
		success: ricercaAttiviSuccess ,
		error: errorHandler ,
		});	

}


function ricercaAttiviSuccess(xml){

	$('#tabAttivi').html("");

	var xmlString = $(xml);	

	// cerco se ci sono interventi attivi
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
	               					'<h6 style="text-transform:uppercase; margin-bottom:0;">'+title+'</h6>'+
	               					'<p style="text-align:justify; margin-right:8%; font-size:0.8em; height:65px; overflow:hidden;">'+description+'</p>'+
	               				'</div></div></button>');
							//mettiamo anche la data? il nome del professionista? che tipo di richiesta è?

		});
				

	}

	//se non ci sono interventi attivi vai su ricerca in zona
	else{

		ricercaInZona();
	}

}





	



/* Funzione per il menu a tendina per mostrare sul bottone l'elemento selezionato */

function menuTendina(){
  
  $(".dropdown-menu li a").click(function(){
    
    $("#tendina:first-child").html($(this).text()+ ' <span class="caret"></span>');
     $("#tendina:first-child").val($(this).text());
  });

}
