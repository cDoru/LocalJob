/* 
 * Funzioni per: profilo-professionista.html
 */

var cliccato = false;	//indica se il bottone commenti in "profilo-professionista" è già stato cliccato

//il percorso delle immagini per il rating
var stellaVuota = "<img src='img/starOff.png' style='width:20px;' />";
var stellaPiena = "<img src='img/starOn.png' style='width:20px;' />";
var stellaPienaRiallineata = "<img src='img/starOn.png' style='width:20px;margin-top:-4px;' />";


//MOSTRA/NASCONDE I COMMENTI ALLA PAGINA "profilo-professionista"
function showCommentList(nick)
{	
	//se il bottone è già stato cliccato
	if(cliccato)
	{
		$('#commentList').hide();
		$('#icoBottone').attr('src', './img/glyphicons/white_ver/224A.PNG');
		cliccato = false;	//semaforo
	}
	//se ancora non lo è stato
	else
	{
		$('#loading').fadeIn('fast');
		//richiama i commenti dal server
		commentami(nick);
		$('#commentList').show();
		$('#icoBottone').attr('src', './img/glyphicons/white_ver/224B.PNG');
		cliccato = true;
	}
}

//RICHIAMA I DATI DEL PROFESSIONISTA ALL'APERTURA DELLA PAGINA "profilo-professionista"
function importaDatiProf(nick)
{
	//la schermata di caricamento è già mostrata all'avvio
	$.ajax({
		async: false,
		type: 'GET',
		url: 'http://95.141.45.174/professional/'+nick+'/',			
		crossDomain:true,
		complete: function(){$('#loading').fadeOut('fast')},
		success: importaSuccesso,
		error: errorHandler
		});	
}
//GESTISCE E MOSTRA I RISULTATI OTTENUTI DALLA CHIAMATA AJAX PRECEDENTE
function importaSuccesso(xml)
{
	var xmlString = $(xml);
	//estrapola solamente i dati necessari
	nome = $(xmlString).find("name").text();
	cognome = $(xmlString).find("cognome").text();
	descrizione = $(xmlString).find("description").text();
	costService = $(xmlString).find("costService").text();
	costoOrario = $(xmlString).find("costPerHour").text();
	quality = $(xmlString).find("qualityRating").text();
	reliability = $(xmlString).find("reliabilityRating").text();
	kindness = $(xmlString).find("kindnessRating").text();
	avatar = $(xmlString).find("avatarPath").text();
	numInterventi = $(xmlString).find("numInterventi").text();
	telefono = $(xmlString).find("numTelefono").text();
	//latitudine = $(xmlString).find("latitude").text();
	//longitudine = $(xmlString).find("longitude").text();
	//indirizzo = $(xmlString).find("indirizzo").text();
	//ragioneSociale = $(xmlString).find("ragioneSociale").text();
	
	//cicla, visto che i mestieri richiesti possono essere diversi
	var tag ="";
	$(xmlString).find("professionType").each(function( index ) {
		  tag = tag+$(this).text()+"\n";
	});
	//cicla, visto che i badge possono essere piu' di uno
	var badge ="";
	$(xmlString).find("badge").each(function( index ) {
		  badge = badge+$(this).text()+"\n";
	});
	
	//e li mostra a video
	$('#nome').html(nome + ' ');
	$('#cognome').html(cognome);
	$('#nominativo').html(nome);	//il nome è mostrato anche sul pulsante
	$('#descrizione2').html(descrizione);
	$('#costoChiamata').html(costService + ' &euro;');
	$('#costoOrario').html(costoOrario + ' &euro;');
	$('#numInterventi').html(numInterventi);
	$('#numTelefono').append('<a class="btn btn-large btn-success btn-block" type="button" id="numTelefono" href="tel:'+telefono+'">'+
	'<img id="icoCall" src="./img/glyphicons/white_ver/170.PNG"/>&nbsp;&nbsp;CONTATTA </a><br/>');
	$('#tag').html(tag);
	$('#badge').html(badge);
	
	//gestione dell'immagine - se non caricata uso default
	avatar = controlloFotoDefault(avatar);
	$('#avatar').attr('src', avatar);
	
	//gestione del rating - il secondo parametro serve per capire dove mostrare l'info
	rating(quality, 1); 
	rating(reliability, 2);
	rating(kindness, 3);
}

//GESTIONE DEI RATING DEL PROFESSIONISTA
function rating(voto, categoria)
{
	//arrotonda il valore e mostra il numero di stelle appropriato
	switch(Math.round(voto))
	{
    	case 0: stelle =  stellaVuota + stellaVuota + stellaVuota + stellaVuota + stellaVuota; break;
    	case 1: stelle =  stellaPiena + stellaVuota + stellaVuota + stellaVuota + stellaVuota; break;
    	case 2: stelle =  stellaPiena + stellaPiena + stellaVuota + stellaVuota + stellaVuota; break;
    	case 3: stelle =  stellaPiena + stellaPiena + stellaPiena + stellaVuota + stellaVuota; break;
    	case 4: stelle =  stellaPiena + stellaPiena + stellaPiena + stellaPiena + stellaVuota; break;
    	case 5: stelle =  stellaPiena + stellaPiena + stellaPiena + stellaPiena + stellaPiena; break;
    }
	//in base al secondo parametro sa dove mostrare l'info
	switch(categoria)
	{
    	case 1: $('#quality').html(stelle); break;
    	case 2: $('#reliability').html(stelle); break;
    	case 3: $('#kindness').html(stelle); break;
    }
}

//RICHIAMA I COMMENTI RELATIVI AL PROFESSIONISTA
function commentami(nick)
{
	//la schermata di caricamento è attivata nel metodo predecente
	$.ajax({
		async: false,
		type: 'GET',
		url: 'http://95.141.45.174/professional/'+nick+'/comments',			
		crossDomain:true,
		complete: function(){$('#loading').fadeOut('fast')},
		success: caricaCommenti,
		error: errorHandler
		});		
}
function caricaCommenti(xml)
{
	//azzera la lista commenti prima di caricarli 
	$('#commentList').html('');	
	
	var xmlString = $(xml);
	var checkVuoto = xmlString.text();
	//controllo se vi sono messaggi
	if(checkVuoto == "")
	{
		$('#commentList').html('NON CI SONO COMMENTI');
	}else
	{
		//gestisce le diverse informazioni
		$(xmlString).find("comment").each(function () {
			var $worker = $(this);
		    nick = $worker.find('nickname').text();
		    testo = $worker.find('text').text();
		    data = $worker.find('date').text();
		    titolo = $worker.find('commentTitle').text();
		    quality = $worker.find('qualityRating').text();
		    reliability = $worker.find('reliabilityRating').text();
		    kindness = $worker.find('kindnessRating').text();
		    
		    //gestione del rating
		    switch(Math.round(quality))
		    {
		    	case 0: stelle =  '0' + stellaPienaRiallineata; break;
		    	case 1: stelle =  '1' + stellaPienaRiallineata; break;
		    	case 2: stelle =  '2' + stellaPienaRiallineata; break;
		    	case 3: stelle =  '3' + stellaPienaRiallineata; break;
		    	case 4: stelle =  '4' + stellaPienaRiallineata; break;
		    	case 5: stelle =  '5' + stellaPienaRiallineata; break;
		    }
		    quality = '<div style="width:33%; float:left;">Qualit&agrave;<br/>'+
		    	'<span style="font-size:2.5em; font-weight:bold;">'+stelle+'</span></div>';
		    switch(Math.round(reliability))
		    {
				case 0: stelle =  '0' + stellaPienaRiallineata; break;
				case 1: stelle =  '1' + stellaPienaRiallineata; break;
				case 2: stelle =  '2' + stellaPienaRiallineata; break;
				case 3: stelle =  '3' + stellaPienaRiallineata; break;
				case 4: stelle =  '4' + stellaPienaRiallineata; break;
				case 5: stelle =  '5' + stellaPienaRiallineata; break;
		    }
		    reliability = '<div style="width:33%; float:left;">Affidabilit&agrave;<br/>'+
		    '<span style="font-size:2.5em; font-weight:bold;">'+stelle+'</span></div>';
		    switch(Math.round(kindness))
		    {
				case 0: stelle =  '0' + stellaPienaRiallineata; break;
				case 1: stelle =  '1' + stellaPienaRiallineata; break;
				case 2: stelle =  '2' + stellaPienaRiallineata; break;
				case 3: stelle =  '3' + stellaPienaRiallineata; break;
				case 4: stelle =  '4' + stellaPienaRiallineata; break;
				case 5: stelle =  '5' + stellaPienaRiallineata; break;
		    }
		    kindness = '<div style="width:33%; float:left;">Gentilezza<br/>'+
		    '<span style="font-size:2.5em; font-weight:bold;">'+stelle+'</span></div>';
			
		    //e infine le appende
		    $('#commentList').append('<div class="commento" style="font-size:0.8em;">'+
		    		'<span style="font-weight:bold; font-style:italic;">'+titolo+'</span><span style="margin-left:20px; margin-right:20px;">di <b>'+
		    		nick+'</b></span><span>'+data+'</span><span class="post"><p class="post2">'+testo+'</p></span>'
		    		+quality+reliability+kindness+'</div><br/><br/><hr>');     
		});
	}
}