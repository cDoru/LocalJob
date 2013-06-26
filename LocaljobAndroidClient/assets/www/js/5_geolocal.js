/* 
 * Funzioni per: where-are-you.html
 */

var position_lat;			//latitudine geolocalizzata
var position_long;			//longitudine geolocalizzata

var geocoder;				//maps

var xml_case;				//xml ricevuto

//CONTROLLA SE L'UTENTE HA GIA' IMPOSTATO UN DOMICILIO
function controlloIndirizzo()
{	
	$.ajax({
        type: 'GET',
        url: 'http://95.141.45.174/getaddress/',
        contentType: 'application/x-www-form-urlencoded',
        crossDomain: true,
        success: function(xml)
        {        	
        	xml_case = $(xml);	
        	//verifica se c'è un domicilio salvato
        	if($(xml_case).find("home").length > 0)
        	{
        		//se sì, precompila la form del tab "Casa"
        		goTabCasa(true);
        	}
        	else
        	{
        		//altrimenti geolocalizza la posizione e precompila il form del tab "Altro"
        		goTabAltro(false);	
        	}
        },
        error: errorHandler
     })
}

//GEOLOCALIZZA IL CLIENT E ATTIVA TAB "Altro" DI "where-are-you"
function goTabAltro(indirizzo)
{
	//controllo: se non ha indirizzi predefiniti il tab casa non è cliccabile		
	if (indirizzo == false)
	{	
    	$('#tab_casa').attr('class','disabled');
    	$('#tab_casa').html('<a>Casa</a>');
	}
	else
	{
		//altrimenti li conta
		numero_case = $(xml_case).find("home").size();
		//se è uno solo, mostra un solo tab cliccabile
		if(numero_case < 2)
		{
			var $casa = $(xml_case).find("home");
			var nome = $casa.find("nome").text();
	    	$('#tab_casa').attr('class','');
	    	$('#tab_casa').html('<a href="#tabCasa" data-toggle="tab" style="border:1px solid #ffffff;"> '+nome+' </a>');
		}
		//se è più di uno, mostra un menu a tendina cliccabile
		else
		{
			var $casa = $(xml_case).find("home");
			//il primo in lista sarà il principale
			var nome = $casa.find("nome").eq(0).text();			
			$('#tab_casa').attr('class','dropdown');
	    	$('#tab_casa').html('<a href="#" class="dropdown-toggle" data-toggle="dropdown" id="tendina" onclick="menuTendina()" style="border:1px solid #ffffff;"> '+
	    			nome+' <span class="caret"></span></a><ul id="casaType" class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu"></ul>');	
	    	//gli altri trovati verranno appesi di seguito
	    	for(var i=0; i<numero_case ; i++)
	    	{
	    		nome_temp = $casa.find("nome").eq(i).text();
	    		$('#casaType').append('<li><a tabindex="-1" href="javascript:mostraCasa('+i+');"> '+nome_temp+' </a></li>');
	    	}
		}
	}
	//Il tab altro è attivato e viene mostrato il div #tabAltro
	$('#tab_altro').attr('class','active');
	$('#tab_altro').html('<a href="#tabAltro" data-toggle="tab">Altro</a>');
		
	//Attivata la pagina tabAltro e disattivata tabCasa
	$('#tabAltro').attr('class','tab-pane active');
	$('#tabCasa').attr('class','tab-pane');
		
	//specifica da quale modalita' è stato invocato il metodo
	controller_geolocation = "InvioUrgenza";
	//attiva la geolocalizzazione
	initiate_geolocation();
}

//ATTIVA IL TAB "Casa" DI "where-are-you"
function goTabCasa(indirizzo)
{	
	//la linguetta "Altro" è resa cliccabile
	$('#tab_altro').attr('class','');
	$('#tab_altro').html('<a onclick="goTabAltro(true)" data-toggle="tab" style="border:1px solid #ffffff;">Altro</a>');	
	//aostra tabCasa e nasconde tabAltro
	$('#tabAltro').attr('class','tab-pane');
	$('#tabCasa').attr('class','tab-pane active');
	
	//conta gli indirizzi salvati dall'utente
	numero_case = $(xml_case).find("home").size();	
	
	//se è uno solo, mostra un solo tab cliccabile
	if(numero_case < 2)
	{	
		var $casa = $(xml_case).find("home");
		var nome = $casa.find("nome").text();

    	$('#tab_casa').attr('class','active');
    	$('#tab_casa').html('<a href="#tabCasa" data-toggle="tab" style="border:1px solid #ffffff;"> '+nome+' </a>');
	}
	//se è più di uno, mostra un menu a tendina cliccabile
	else
	{
		var $casa = $(xml_case).find("home");
		//il primo in lista sarà il principale
		var nome = $casa.find("nome").eq(0).text();
		$('#tab_casa').attr('class','dropdown , active');
    	$('#tab_casa').html('<a href="#" class="dropdown-toggle" data-toggle="dropdown" id="tendina" onclick="menuTendina()" style="border:1px solid #ffffff;"> '+
    			nome+' <span class="caret"></span></a><ul id="casaType" class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu"></ul>');
    	
    	//gli altri trovati verranno appesi di seguito
    	for(var i=0; i<numero_case ; i++)
    	{
    		nome_temp = $casa.find("nome").eq(i).text();
    		$('#casaType').append('<li><a tabindex="-1" href="javascript:mostraCasa('+i+');"> '+nome_temp+' </a></li>');
    	}
	}
	//in entrambi i casi mostra i dati del primo (o unico) indirizzo
	mostraCasa(0);
}

//MOSTRA A VIDEO LE INFORMAZIONI SUL DOMICILIO SELEZIONATO
function mostraCasa(i)
{	
	/* Per sicurezza (se si arriva da tab altro):
	*  - attiva la pagina tabCasa e disattiva il div tabAltro
	*  - il tasto tab_altro deve essere deselezionato e cliccabile  
	*  */	
	$('#tabAltro').attr('class','tab-pane');
	$('#tabCasa').attr('class','tab-pane active');
	
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

	//mostra l'indirizzo su mappa
	initialize_map("casa", sessionStorage.lat, sessionStorage.long);
	
	$('#Indirizzo_casa').attr('value',indirizzo_mostrato);
	$('#nCiv_casa').attr('value',civ_mostrato);
	$('#CAP_casa').attr('value',cap_mostrato);
	$('#Citta_casa').attr('value',citta_mostrato);
	$('#Provincia_casa').attr('value',provincia_mostrato);
}

//MOSTRA LA MAPPA
function initialize_map(tipo, lat, long)
{	
	var latlng = new google.maps.LatLng(lat,long);

	//imposta le opzioni di visualizzazione
	var options = { zoom: 15,
			center: latlng,
	        mapTypeId: google.maps.MapTypeId.ROADMAP,
	        disableDefaultUI : true
	};
	              
	//crea l'oggetto mappa
	if(tipo == "casa")
	{
		var map = new google.maps.Map(document.getElementById('map_casa'), options);
	}
	else if(tipo == "altro")
	{
		var map = new google.maps.Map(document.getElementById('map_altro'), options);
	}
	  
	//aggiunge il marker
	marker = new google.maps.Marker({ position: latlng,
		map: map, 
        title: 'Questo è un testo di suggerimento' });
}

//FUNZIONE DI REVERSE GEOCODING
function codeLatLng(position_lat, position_long)
{
	geocoder = new google.maps.Geocoder();

	  var lat = position_lat;
	  var lng = position_long;
	  var latlng = new google.maps.LatLng(lat, lng);
	  geocoder.geocode({'latLng': latlng}, function(results, status){
	    if (status == google.maps.GeocoderStatus.OK)
	    {
	    	
	    	for (var i=0; i<results[0].address_components.length; i++)
	    	{ 	
	    		var val_street = results[0].address_components[i].types[0];
	    		
	    		switch (val_street)
	    		{
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
	    	//Inserisce i valori nella form
	    	$('#Indirizzo_altro').attr('value',indirizzo);
	    	$('#nCiv_altro').attr('value',nciv);
	    	$('#CAP_altro').attr('value',cap);
	    	$('#Citta_altro').attr('value',citta);
	    	$('#Provincia_altro').attr('value',provincia);
	    }
	    else
	    {
	      alert('Geocoder failed due to: ' + status);
	    }
	  });
	}

//SALVA SU SERVER IL NUOVO INDIRIZZO FORNITO DALL'UTENTE
function salvaIndirizzo()
{
	nomeLuogo = $('#nome_luogo').val();
	nomeVia = $('#Indirizzo_altro').val();
	civico = $('#nCiv_altro').val();
	cap = $('#CAP_altro').val();
	comune = $('#Citta_altro').val();
	provincia = $('#Provincia_altro').val();
	
	//controlla i campi obbligatori
	if(nomeLuogo == '')
	{
		alert("Inserisi un nome per il luogo scelto.")
	}
	else
	{
		//schermata di caricamento
		$('#loading').fadeIn('fast');
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
		          //nasconde la schermata di caricamento
		          complete: function(){$('#loading').fadeOut('fast')},
		          success: ajaxIndirizzoSalvato(nomeLuogo),
		          error: function(){}
		          //error: errorHandler
		});
	}		 
}
function ajaxIndirizzoSalvato(nomeLuogo){
	alert("Indirizzo salvato come: "+nomeLuogo);
}

//INVIO DELLA RICHIESTA DI URGENZA
function inviaUrgenza(luogo)
{
	$('#loading').fadeIn('fast');
	if(luogo == "casa")
	{
		sessionStorage.complete_address = $('#Indirizzo_casa').val()+", "+$('#nCiv_casa').val()+"," +
				" "+$('#CAP_casa').val()+", "+$('#Citta_casa').val()+", "+$('#Provincia_casa').val();	
	}
	else if(luogo == "altro")
	{
		sessionStorage.complete_address = $('#Indirizzo_altro').val()+", "+$('#nCiv_altro').val()+", "+
		$('#CAP_altro').val()+", "+$('#Citta_altro').val()+", "+$('#Provincia_altro').val();
	}
	
	$.ajax({
          type: 'POST',
          url: 'http://95.141.45.174/request/',
          contentType: 'application/x-www-form-urlencoded',
          crossDomain: true,
          data: {'titolo': sessionStorage.problemTitle, 
        	  'descrizione': sessionStorage.problemDescription, 
        	  'pathfoto': sessionStorage.problemImg, 
        	  'latitudine': sessionStorage.lat, 
        	  'longitudine': sessionStorage.long, 
        	  'isemergenza':  true, 
        	  'tiporichiestauno': sessionStorage.problemType, 
        	  'tiporichiestadue': 0,
        	  'tiporichiestatre': 0,
        	  'stato': 0
          },
          complete: function(){$('#loading').fadeOut('fast')},
          success: function(){window.location='intervento-invio.html';},
          error: errorHandler
       });
}