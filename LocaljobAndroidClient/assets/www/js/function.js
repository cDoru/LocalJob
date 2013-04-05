var tipoUtente;
var problemTitle;
var problemType;
var problemDesription;

$(document).ready(function()	//funzioni che si avviano al caricamento della pagina
{
	jQuery.support.cors = true;
	
	
	
	
	//script per il form della data di nascita
	var firstYear = 1920;
	var lastYear = 1999;
	for(var i =firstYear; i<=lastYear; i++) {
	       $('#anni').append('<option>'+i+'</option>');
	}
	
	//roba per il tooltip
	$('.notifiche').popover({
		'html': 'true',
        'selector': '',
        'placement': 'bottom',
        'title': 'Notifiche',
        'content': '<div class="well well-small">Guarda il tutorial di Local Job</div>'+
        '<div class="well well-small">Aggiorna il tuo profilo per iniziare</div>',
        'container': '.contNotifiche'
      });


	// Controller per il TILT LANDSCAPE-PORTRAIT
	window.addEventListener("orientationchange", orientationChange, true);
});

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
	$('#contenitore').html("<form class='form-signin' action='javascript:login();'>" +
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
	problemType =  $('#problemType').val(); 
	problemDesription =  $('#problemDesription').val(); 
	alert("prova: "+problemTitle+" - "+problemType+" - "+problemDesription);
	
	window.location='where-are-you.html';
}

/*
 * Funzioni chiamate al server
 * 
 * */

function login()	//gestisce il login dell'utente
{
	//alert("prova!");
	user =  $('#user').val(); 
	password =  $('#password').val(); 
	//alert("user: "+ user + " e password: " + password);
	$.ajax({
          type: 'POST',
          url: 'http://95.141.45.174/login',
          //contentType:"application/json",
          //dataType:'jsonp',
          //prova della schermata di attesa
          ajaxStart: function(){
        	  window.location='wait.html';
          },
          contentType: 'application/x-www-form-urlencoded',
          crossDomain: true,
          data: {'userId': user, 'password': password},
          success: ajaxLOGIN,
          error: errorHandler
       })
}

//Registrazione utente
function user_signin()
{
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
	window.location='interventi-attivi.html';
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



function controlloIndirizzo(){
	
	//Chiamata al server che controlla se l'utente ha già un indirizzo predefinito oppure no
	
	//ora per prova facciamo finta che non abbia indirizzo
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
			$('#tab_casa').html('<a onclick="goTabCasa(true);" data-toggle="tab">Casa</a>');
		}
		//Il tab altro è attivato e viene mostrato il div #tabAltro
		$('#tab_altro').attr('class','active');
		$('#tab_altro').html('<a href="#tabAltro" data-toggle="tab">Altro</a>');
		
		//Attivo la pagina tabAltro e disattivo tabCasa
		$('#tabAltro').attr('class','tab-pane active');
		$('#tabCasa').attr('class','tab-pane');
		
		//Fa partire la geolocalizzazione
		id_watch = navigator.geolocation.watchPosition(inCasoDiSuccesso);
		
		//Mostra il punto sulla mappa
		$('#map_altro').html('<h2>La tua posizione attuale</h2><span id="posizione_corrente"></span>');
		
		//una volta che mi darà la posizione corrente, dalle google API trovo indirizzo ecc
		//dati di prova
		indirizzo ="via mura anteo zamboni";
		nciv="2";
		cap="40127";
		citta="bologna";
		provincia="BO";
		//
		//Inserisco i valori nel form
		$('#Indirizzo_altro').attr('value',indirizzo);
		$('#nCiv_altro').attr('value',nciv);
		$('#CAP_altro').attr('value',cap);
		$('#Citta_altro').attr('value',citta);
		$('#Provincia_altro').attr('value',provincia);

}

function goTabCasa(indirizzo){
	//Funzione che manda al tab casa (quindi senza geolocalizzazione)
	alert("ha indirizzo");
	
	//Tira giù i dati della casa dal DB
	//Poi fai un controllo...se ha più indirizzi salvati...se ne ha 1 
	//visualizzi il tab normale senò quello con più opzioni
	
	numero_case = 1; //il numero di case viene richiesto dal server

	//Fa un controllo, se c'è solo una casa mostra il tab normale, altrimenti mostra
	//l'elenco
	if(numero_case < 2){
		//Il tab casa è attivato e viene mostrato il div #tabCasa
    	$('#tab_casa').attr('class','active');
    	$('#tab_casa').html('<a href="#tabCasa" data-toggle="tab">Casa</a>');	
	}
	else{
		$('#tab_casa').attr('class','dropdown');
    	$('#tab_casa').html('<a href="#tabCasa" class="dropdown-toggle" data-toggle="dropdown">Casa <b class="caret"></b></a>'+
    		'<ul class="dropdown-menu">'+
    		'<li>Casa Mare</li>'+
    		'<li>Ufficio</li>'+
    		'</ul>');	
	}
		
	//Il tab altro è cliccabile e viene mostrato il div #tabAltro
	$('#tab_altro').attr('class','');
	$('#tab_altro').html('<a onclick="goTabAltro(true)" data-toggle="tab">Altro</a>');
	
	//Attivo la pagina tabCasa e disattivo tabAltro
	$('#tabAltro').attr('class','tab-pane');
	$('#tabCasa').attr('class','tab-pane active');
	

	//Mostra la casa sulla mappa
	$('#map_casa').html('<h2>La posizione della casa</h2><span id="posizione_casa"></span>');
	
	//faccio chiamata al database e mi darà tutti i dati della casa
	//dati di prova
	indirizzo ="via cantoncello";
	nciv="31";
	cap="40026";
	citta="Imola";
	provincia="BO";
	//
	$('#Indirizzo_casa').attr('value',indirizzo);
	$('#nCiv_casa').attr('value',nciv);
	$('#CAP_casa').attr('value',cap);
	$('#Citta_casa').attr('value',citta);
	$('#Provincia_casa').attr('value',provincia);
}
