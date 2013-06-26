/*
 * Funzioni per: interventi-attivi.html
 * (gestione e visualizzazione degli interventi e dei professionisti in zona)
 */

var controller_geolocation;	//quale modalita' (invioUrgenza o ricercaInZona) ha richiesto la geolocalizzazione
var filtroIntervento;		
var orderType;
var nick;

//gestione grafica barra di avanzamento interventi - funzione barraAvanzamento()
var barStateString;
var barStateStringIt;
var barState;
var barStateActive;
var barProgressState;


//CERCA LE COORDINATE GPS PER LA RICERCA INTORNO A TE
function ricercaCoordinateInZona(filtroPrecedente, ordinamento)
{	
	//setta la variabile controller per la funzione initiate_geolocation(), e geolocalizza
	sessionStorage.filtroPrecedente = filtroPrecedente;
	controller_geolocation = "ricercaInZona";
	initiate_geolocation();
}
//EFFETTUA LA RICERCA INTORNO A TE
function ricercaInZona(filtroPrecedente, ordinamento)
{
	$('#loading').fadeIn('fast');
	//azzero sempre prima di incollare dati
	$('#toDo').html('');
	
	//piccole modifiche grafiche - bottone cliccato
	$('#imgIntorno').attr('src', './img/glyphicons/white_ver/153.PNG');
	$('#butIntorno').attr('class', 'btn btn-block btn-large btn-primary disabled');
	//ripristiniamo altro bottone
	$('#imgAttivi').attr('src', './img/glyphicons/white_ver/154.PNG');
	$('#butAttivi').attr('class', 'btn btn-block btn-large btn-primary');

	filtroIntervento = filtroPrecedente;
	orderType = ordinamento;
	
	//dati latitudine e longitudine richiede la lista dei professionisti in zona
	$.ajax({
			async: false,
			type: 'GET',		
			url: 'http://95.141.45.174/search?latitudine='+sessionStorage.lat+'&longitudine='+sessionStorage.long,		
			crossDomain:true,
			//complete: function(){$('#loading').fadeOut('fast')},
			success: ricercaInZonaSuccess,
			error: errorHandler
			});	

	//sovrascrive i valori di menuTendina() con la categoria 
	var categoria;
	if(typeof filtroIntervento === "undefined")
	{
		categoria = "Categoria";
	}
	else
	{
		categoria = filtroIntervento;
	}

	//appende quanto ottenuto
	$('#toDo').prepend(
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
	            '<a href="#" onclick="ricercaInZona(\''+filtroIntervento+'\',\'rating\')" class="btn btn-large btn-info"'+
	            'style="margin:0 2px 0 2px;"><i class="icon-star icon-white"></i></a>'+
	            '<a href="#" onclick="ricercaInZona(\''+filtroIntervento+'\',\'cost\')" class="btn btn-large btn-info">'+
	            '<i class="icon-shopping-cart icon-white"></i></a></div>'+
	    '</div>'+
	    '<div style="height:20px;"></div>');
	            
		//aggiorna il menu a tendina per effettuare filtri
		$('.dropdown-menu li a').click(function() {
    		filtroIntervento = $(this).text();
    		ricercaInZona(filtroIntervento, "");
		});
}
//PREDISPONE L'ORDINAMENTO DEI PROFESSIONISTI
function ricercaInZonaSuccess(xml)
{
	//inserisce i professionisti in un array
	var xmlString = $(xml);
	var workerArrays = new Array();
	if($(xmlString).find("worker").length > 0)
	{
		workerArrays = $(xmlString).find("worker");

		//ordinamento per distanza
		var workerSortedByGeo = $(xml).find('worker').get().sort(function(a, b) {
			var valA = $(a).find('distance').text();
			var valB = $(b).find('distance').text();
			return valA < valB ? -1 : valA == valB ? 0 : 1;
	    });
		//ordinamento per prezzo orario
		var workerSortedByCost = $(xml).find('worker').get().sort(function(a, b) {
			var valA = $(a).find('costPerHour').text();
			var valB = $(b).find('costPerHour').text();
			return valA < valB ? -1 : valA == valB ? 0 : 1;
	    });
		//ordinamento per valutazione
		var workerSortedByRating = $(xml).find('worker').get().sort(function(a, b) {
			var valA = $(a).find('rating').text();
			var valB = $(b).find('rating').text();
			return valA > valB ? -1 : valA == valB ? 0 : 1;
	    });

		//in base al filtro selezionato, effettua un determinato ordinamento
		if(orderType == 'cost')
		{
			workerSorted = workerSortedByCost;
		}
		else if(orderType == 'rating')
		{
			workerSorted = workerSortedByRating;
		}
		else
		{
			workerSorted = workerSortedByGeo;
		}
		
		//per ogni professionista memorizza i dati
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
	        
	        //aggiorna la valutazione
	        switch(Math.round(rating)) {
	        case 0: rating =  stellaVuota + stellaVuota + stellaVuota + stellaVuota + stellaVuota; break;
	        case 1: rating =  stellaPiena + stellaVuota + stellaVuota + stellaVuota + stellaVuota; break;
	        case 2: rating =  stellaPiena + stellaPiena + stellaVuota + stellaVuota + stellaVuota; break;
	        case 3: rating =  stellaPiena + stellaPiena + stellaPiena + stellaVuota + stellaVuota; break;
	        case 4: rating =  stellaPiena + stellaPiena + stellaPiena + stellaPiena + stellaVuota; break;
	        case 5: rating =  stellaPiena + stellaPiena + stellaPiena + stellaPiena + stellaPiena; break;
	        }
	        
	        var pagina = "javascript:profiloPro('"+nickname+"')";
	        //e appende i risultati
	        if((typeof filtroIntervento === "undefined") || tag.indexOf(filtroIntervento) != -1 || filtroIntervento == 'Tutti') {
		        $('#toDo').append('<button class="btn btn-block text-center" onclick="'+pagina+'"><div style="width:70%; float:left;">'+
		        		'<p><b>'+nome+' '+cognome+'</b></p>'+
		        		'<p style="font-size:0.8em; margin-top:-10px;"><span style="text-transform:uppercase">'+tag+'</span></p>'+
		        		'<p style="margin-top:-10px;">'+rating+'</i></p>'+
		        		'<p style="font-size:0.8em; margin-top:-10px; margin-bottom:-5px;">'+distance+'</p></div>'+
		        		'<div style="width:30%; float:right; line-height:260%;">'+
		        		'<div style="border:2px solid black; width:80%;"><i class="icon-headphones"></i> '+costService+' &euro;<br/>'+
		        		'<i class="icon-shopping-cart"></i> '+costHour+' &euro;/h</div>'+
		        		'</div></button>');  
		    }
		});
	}
	else
	{
    	$('#toDo').append('<span style="color:white;">NON CI SONO ANCORA PROFESSIONISTI<br/> INTORNO A TE</span>');
    }
	$('#loading').fadeOut('fast');
} 

//RICHIEDE AL SERVER GLI INTERVENTI ATTIVI
function ricercaAttivi()
{	
	$('#loading').fadeIn('fast');
	if(localStorage.getItem('notification'))
	{
		var retrievedObject = localStorage.getItem('notification');
		notificaTmp = JSON.parse(retrievedObject);
		elaboraNotifica(notificaTmp);
	}
	
	//la richiesta cambia se effettuata dal cliente o dal professionista
	if(localStorage.userType == "cliente")
	{
		tipoRichiesta = "openjob";
	}
	else if(localStorage.userType == "professionista")
	{
		tipoRichiesta = "listjobs";
	}
	$.ajax({
		async: false,
		type: 'GET',
		url: 'http://95.141.45.174/'+tipoRichiesta,			
		crossDomain:true,
		//complete: function(){$('#loading').fadeOut('fast')},
		success: ricercaAttiviSuccess,
		error: errorHandler
		});	
}
function ricercaAttiviSuccess(xml)
{
	//azzera sempre prima di incollare i dati ottenuti
	$('#toDo').html("");
	
	//piccole modifiche grafiche - bottone cliccato
	$('#imgAttivi').attr('src', './img/glyphicons/white_ver/153.PNG');
	$('#butAttivi').attr('class', 'btn btn-block btn-large btn-primary disabled');
	//ripristiniamo altro bottone
	$('#imgIntorno').attr('src', './img/glyphicons/white_ver/154.PNG');
	$('#butIntorno').attr('class', 'btn btn-block btn-large btn-primary');
	
	//verifica se ci sono interventi attivi
	var xmlString = $(xml);	
	if($(xmlString).find("request").length > 0)
	{
		//cerco tutti gli interventi attivi e li appendo
		$(xmlString).find("request").each(function (){
			var $request = $(this);
			var id = $request.find("id").text();
			var date = $request.find("date").text();
			var description = $request.find("description").text();
			var state = $request.find("state").text();
			var picture = $request.find("picture").text(); //path della foto
			var title = $request.find("title").text(); 

			//gestione dell'immagine - se non caricata uso default
			picture = controlloFotoDefault(picture);

			//gestione grafica dell'avanzamento
			 barraAvanzamento(state);
			 
			//infine appende gli interventi attivi
     		var pagina = "javascript:interventoCli('"+id+"');";
			$('#toDo').append('<a class="btn btn-block text-center" href="'+pagina+'" style="padding:2%;">'+
                            '<div class="row-fluid">'+	
                      			'<div class="span12">'+
                        			'<div class="progress ' + barProgressState + ' progress-striped ' + barStateActive + '" style="margin-bottom:0;">'+
                          				'<div class="bar" style="'+barState+'"></div>'+
                        			'</div></div></div>'+
                   			'<div class="row-fluid">'+
               					'<div style="width:30%; float:left;">'+
               						'<img src="'+picture+'" style="width:70%; margin-left:15%;" class="img-polaroid">'+
               					'</div>'+
	               				'<div style="width:100%; margin-top:-10px;">'+
	               					'<h6 style="text-transform:uppercase; text-align:left; margin-bottom:0;">'+title+'</h6>'+
	               					'<p style="text-align:left; margin-right:8%; font-size:0.8em; height:15px; overflow:hidden;">'+description+'</p>'+
	               					'<p style="text-align:left; margin-right:8%; font-size:0.8em; height:15px; overflow:hidden;">'+
	               					'<b>Iniziato il: </b>' + date+'</p>'+
	               					'<p style="text-align:left; margin-right:8%; font-size:0.8em; height:65px; overflow:hidden;">'+
	               					'<b>Stato intervento: </b>' +barStateStringIt+'</p>'+
	               				'</div></div></a>');
		
		});
	}else
	{	
		$('#toDo').html('<span style="color:white;">NON HAI NESSUN<br/> INTERVENTO ATTIVO</span>');
	}
	$('#loading').fadeOut('fast');
}

//GESTIONE GRAFICA DELLA BARRA DI AVANZAMENTO
function barraAvanzamento(state)
{
		switch(state){
		case "0":   barStateString = "default"; 
					barStateStringIt = "La richiesta &egrave; stata inviata. Attendi che il professionista risponda.";
					barState = "width:30%;";
					barStateActive = "active";
					barProgressState = "progress-info";
					break;
		case "1":   barStateString = "research_request_init"; 
					barStateStringIt = "Richiesta inviata ai professionisti in zona";
					barState = "width:30%;";
					barStateActive = "active";
					barProgressState = "progress-info";
					break;
		case "2":   barStateString = "research_professionist_rejected"; 
					barStateStringIt = "Il professionista ha rifiutato l'intervento";
					barState = "width:100%;";
					barStateActive = "";
					barProgressState = "progress-danger";
					break;
		case "3":   barStateString = "research_professionist_accepted"; 
					barStateStringIt = "Sarai contattato dal professionista. Lascia un commento al termine della prestazione.";
					barState = "width:100%;";
					barStateActive = "active";
					barProgressState = "progress-success";
					break;
		case "4":   barStateString = "research_work_annulled"; 
					barStateStringIt = "La richiesta &egrave; stata annullata";
					barState = "width:100%;";
					barStateActive = "";
					barProgressState = "progress-danger";
					break;
		case "5":   barStateString = "research_payment_sent"; 
					barStateStringIt = "Il pagamento &egrave; stato inviato";
					barState = "width:70%;";
					barStateActive = "active";
					barProgressState = "progress-info";
					break;
		case "6":   barStateString = "research_feedback_saved";
					barStateStringIt = "Il feedback &egrave; stato inviato";
					barState = "width:90%;";
					barStateActive = "active";
					barProgressState = "progress-info"; 
					break;
		case "7":   barStateString = "research_hidden"; 
					barStateStringIt = "Hidden";
					barState = "width:100%;";
					barStateActive = "";
					barProgressState = "progress-danger";
					break;
		case "8":   barStateString = "research_consumer_annulled"; 
					barStateStringIt = "Intervento annullato dal consumatore";
					barState = "width:100%;";
					barStateActive = "";
					barProgressState = "progress-danger";
					break;
		case "9":   barStateString = "research_staff_closed"; 
					barStateStringIt = "Intervento annullato dallo staff di LocalJob";
					barState = "width:100%;";
					barStateActive = "";
					barProgressState = "progress-danger";
					break;
		case "10":  barStateString = "research_payment_rejected";
					barStateStringIt = "Il pagamento &egrave; stato rifiutato";
					barState = "width:40%;"; 
					barStateActive = "active";
					barProgressState = "progress-warning";
					break;
		case "11":  barStateString = "research_refounded"; 
					barStateStringIt = "Pagamento rimborsato";
					barState = "width:40%;";
					barStateActive = "active";
					barProgressState = "progress-warning";
					break;
		case "12":  barStateString = "research_sys_locked"; 
					barStateStringIt = "Sys Locked";
					barState = "width:100%;";
					barStateActive = "";
					barProgressState = "progress-danger";
					break;
		case "13":  barStateString = "emergency_request_init"; 
					barStateStringIt = "Richiesta di intervento con urgenza trasmesso ai professionisti";
					barState = "width:10%;";
					barStateActive = "active";
					barProgressState = "progress-info";
					break;
		case "14":  barStateString = "research_work_finished"; 
					barStateStringIt = "Il lavoro &egrave; stato terminato con successo";
					barState = "width:100%;";
					barStateActive = "";
					barProgressState = "progress-success";
					break;
		case "15":  barStateString = "research_feedback_needed"; 
					barStateStringIt = "Il feedback non &egrave; ancora stato rilasciato";
					barState = "width:70%;";
					barStateActive = "active";
					barProgressState = "progress-warning";
					break;
	}
}

//PERMETTE DI RICHIAMARE UN DETERMINATO INTERVENTO
function interventoCli(id)
{
	sessionStorage.id = id;
	window.location='storicoCliente.html';
}

//MOSTRA LE INFORMAZIONI RELATIVE AD UN DETERMINATO INTERVENTO ATTIVO
function mostraStoricoCli(id)
{
	$('#loading').fadeIn('fast');
	
	$.ajax({
		async: false,
		type: 'GET',
		url: 'http://95.141.45.174/getinfojob/'+id+'/',
		crossDomain:true,
		//complete: function(){$('#loading').fadeOut('fast')},
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

	//gestione dell'immagine - se non caricata uso default
	foto = controlloFotoDefault(foto);

	//gestione grafica dell'avanzamento
	 barraAvanzamento(state);
	
	var pagina = "javascript:interventoCli('"+id+"');";
		
	$('#incolla').html('<div class="row-fluid">'+	
              			'<div class="span12">'+
                			'<div class="progress '+barProgressState+' progress-striped '+barStateActive+'" style="margin-bottom:0;">'+
                  				'<div class="bar" style="'+barState+'"></div>'+
                			'</div></div></div>'+
                			'<div class="row-fluid">'+
        					'<p><b>ID INTERVENTO:</b> '+id+'<br/><b>DATA:</b> '+date+'</p>'+
        					'<a href="javascript:mostraPanelFoto()"><img id="foto" src="'+
        					foto+'" style="width:100px;"/></a><br/>'+
        					'Tappa sulla foto per ingrandirla'+
        		    		'<div id="descrizione"><h5 id="titoloIntervento" style="text-transform:uppercase;">'+
        		    		titolo+'</h5><p id="descrizione2">'+descrizione+'</p></div>');
	//aggiorna l'ingrandimento dell'immagine
	$('#fotoGrande').attr('src', foto);
	
	//il bottone di inserisci commento
	if(state==3)
	{
		$('#incolla').append('<a class="btn btn-large btn-block btn-success" href="commento-nuovo.html">LASCIA UN COMMENTO</a>');
	}
	//il bottone di default
	$('#incolla').append('<button class="btn btn-large btn-block btn-inverse" onclick="javascript:history.go(-1);">TORNA INDIETRO</button></div>');

	$('#loading').fadeOut('fast');
}

//MEMORIZZA L'IDENTIFICATIVO DEL PROFESSIONISTA E PORTA ALLA SUA PAGINA
function profiloPro(nick)
{
	sessionStorage.nick = nick;
	window.location='profilo-professionista.html';
}