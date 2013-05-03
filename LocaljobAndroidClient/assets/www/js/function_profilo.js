var nick;
var cliccato = false;	//per sapere se il bottone commenti in "profilo-professionista" è già stato cliccato o no

//rating: stelle piccole
var stellaVuota = "<i class='icon-star-empty'></i>";
var stellaPiena = "<i class='icon-star'></i>";
//rating: stelle grandi
//var stellaVuota = "<img src='./img/glyphicons/black_ver/glyphicons_048_dislikes.png' />";
//var stellaPiena = "<img src='./img/glyphicons/black_ver/glyphicons_049_star.png' />";

function profiloPro(nick){
	//alert(nick);
	sessionStorage.nick = nick;
	window.location='profilo-professionista.html';
}

function showCommentList(nick){		//chiamata ajax + mostra/nasconde i commenti		
	if(cliccato){
		$('#commentList').hide();
		$('#icoBottone').attr('src', './img/glyphicons/white_ver/224A.PNG');
		
		cliccato = false;
	}else{
		$('#loading').fadeIn('fast');		//schermata di caricamento
		commentami(nick);
		$('#commentList').show();
		$('#icoBottone').attr('src', './img/glyphicons/white_ver/224B.PNG');
		cliccato = true;
	}
}

function importaDatiProf(nick) {	//richiama i dati del professionista
	$.ajax({
		async: false,
		type: 'GET',
		url: 'http://95.141.45.174/professional/'+nick+'/',			
		crossDomain:true,
		complete: function(){$('#loading').fadeOut('fast')},		//nasconde la schermata di caricamento
		success: importaSuccesso,
		error: errorLogout
		});	
}

function importaSuccesso(xml) {
	var xmlString = $(xml);	
	//nickname = $(xmlString).find("nickname").text();
	nome = $(xmlString).find("name").text();
	cognome = $(xmlString).find("cognome").text();
	descrizione = $(xmlString).find("description").text();
	//
	var tag ="";
	$(xmlString).find("professionType").each(function( index ) {
		  tag = tag+$(this).text()+"\n";
	});
	//badge = $(xmlString).find("badge").text();
	//da sistemare
	var badge ="";
	$(xmlString).find("badge").each(function( index ) {
		  badge = badge+$(this).text()+"\n";
	});
	//
	latitudine = $(xmlString).find("latitude").text();				//serve?
	longitudine = $(xmlString).find("longitude").text();			//serve?
	costService = $(xmlString).find("costService").text();
	costoOrario = $(xmlString).find("costPerHour").text();
	quality = $(xmlString).find("qualityRating").text();
	reliability = $(xmlString).find("reliabilityRating").text();
	kindness = $(xmlString).find("kindnessRating").text();
	avatar = $(xmlString).find("avatarPath").text();
	numInterventi = $(xmlString).find("numInterventi").text();
	///////////////////queste info non ha senso che le facciamo vedere all'utente
	telefono = $(xmlString).find("numTelefono").text();
	//indirizzo = $(xmlString).find("indirizzo").text();
	//ragioneSociale = $(xmlString).find("ragioneSociale").text();
	

	$('#nome').html(nome + ' ');
	$('#cognome').html(cognome);
	$('#nominativo').html(nome);
	//
	$('#tag').html(tag);
	$('#badge').html(badge);
	
	$('#descrizione2').html(descrizione);
	$('#costoChiamata').html(costService + ' euro');
	$('#costoOrario').html(costoOrario + ' euro');
	$('#numInterventi').html(numInterventi);

	
	if(avatar == 'photo' || avatar == '' || avatar.length == 0){
		//$('#avatar').attr('src', './img/example_photo.png');
		$('#avatar').attr('src', './img/missingAvatar.png');
	}
	else{
		$('#avatar').attr('src', 'http://95.141.45.174'+avatar);
	}
	
	rating(quality, 1);		//il secondo parametro serve per capire dove mostrare l'info
	rating(reliability, 2);
	rating(kindness, 3);


	$('#numTelefono').append('<a class="btn btn-large btn-success btn-block" type="button" id="numTelefono" href="tel:'+telefono+'">'+
									'<img id="icoCall" src="./img/glyphicons/white_ver/170.PNG"/>&nbsp;&nbsp;CONTATTA </a><br/>');
}

function rating(voto, categoria){			//per visualizzare le valutazioni
	
	switch(Math.round(voto)) {
    case 0: stelle =  stellaVuota + stellaVuota + stellaVuota + stellaVuota + stellaVuota + ' (0/5)'; break;
    case 1: stelle =  stellaPiena + stellaVuota + stellaVuota + stellaVuota + stellaVuota + ' (1/5)'; break;
    case 2: stelle =  stellaPiena + stellaPiena + stellaVuota + stellaVuota + stellaVuota + ' (2/5)'; break;
    case 3: stelle =  stellaPiena + stellaPiena + stellaPiena + stellaVuota + stellaVuota + ' (3/5)'; break;
    case 4: stelle =  stellaPiena + stellaPiena + stellaPiena + stellaPiena + stellaVuota + ' (4/5)'; break;
    case 5: stelle =  stellaPiena + stellaPiena + stellaPiena + stellaPiena + stellaPiena + ' (5/5)'; break;
    }
	
	switch(categoria) {
    case 1: $('#quality').html(stelle); break;
    case 2: $('#reliability').html(stelle); break;
    case 3: $('#kindness').html(stelle); break;
    }
}

function commentami(nick) {		//richiama i commenti sul professionista
	$.ajax({
		async: false,
		type: 'GET',
		url: 'http://95.141.45.174/professional/'+nick+'/comments',			
		crossDomain:true,
		complete: function(){$('#loading').fadeOut('fast')},		//nasconde la schermata di caricamento
		success: caricaCommenti,
		error: errorLogout
		});		
}

function caricaCommenti(xml) {
	var xmlString = $(xml);
	var checkVuoto = xmlString.text();
	
	$('#commentList').html('');		//azzera la lista commenti prima di caricarli 
	
	if(checkVuoto == ""){
		$('#commentList').html('NON CI SONO COMMENTI');
	}
	else{
		$(xmlString).find("comment").each(function () {
			var $worker = $(this);
		    nick = $worker.find('nickname').text();
		    testo = $worker.find('text').text();
		    data = $worker.find('date').text();
		    titolo = $worker.find('commentTitle').text();
		    quality = $worker.find('qualityRating').text();
		    reliability = $worker.find('reliabilityRating').text();
		    kindness = $worker.find('kindnessRating').text();
		    
		    switch(Math.round(quality)) {
		    case 0: stelle =  '0/5'; break;
		    case 1: stelle =  '1/5'; break;
		    case 2: stelle =  '2/5'; break;
		    case 3: stelle =  '3/5'; break;
		    case 4: stelle =  '4/5'; break;
		    case 5: stelle =  '5/5'; break;
	    }
		quality = '<div style="width:33%; float:left;">Qualit&agrave;<br/><span style="font-size:2.5em; font-weight:bold;">'+stelle+'</span></div>';
		
		switch(Math.round(reliability)) {
			case 0: stelle =  '0/5'; break;
		    case 1: stelle =  '1/5'; break;
		    case 2: stelle =  '2/5'; break;
		    case 3: stelle =  '3/5'; break;
		    case 4: stelle =  '4/5'; break;
		    case 5: stelle =  '5/5'; break;
	    }
		reliability = '<div style="width:33%; float:left;">Affidabilit&agrave;<br/><span style="font-size:2.5em; font-weight:bold;">'+stelle+'</span></div>';
		
		switch(Math.round(kindness)) {
			case 0: stelle =  '0/5'; break;
		    case 1: stelle =  '1/5'; break;
		    case 2: stelle =  '2/5'; break;
		    case 3: stelle =  '3/5'; break;
		    case 4: stelle =  '4/5'; break;
		    case 5: stelle =  '5/5'; break;
	    }
		kindness = '<div style="width:33%; float:left;">Gentilezza<br/><span style="font-size:2.5em; font-weight:bold;">'+stelle+'</span></div>';
			 
		$('#commentList').append('<div class="commento" style="font-size:0.8em;"><span style="font-weight:bold; font-style:italic;">'+titolo+'</span><span style="margin-left:20px; margin-right:20px;">di <b>'+nick+'</b></span><span>'+data+'</span><span class="post"><p class="post2">'+testo+'</p></span>'+quality+reliability+kindness+'</div><br/><br/><hr>'); 
		//$('#commentList').append('<div class="commento" style="font-size:0.8em; border-bottom:1px solid black; padding-bottom:5px;"><span style="font-weight:bold; font-style:italic;">'+titolo+'</span><span style="margin-left:20px; margin-right:20px;">di <b>'+nick+'</b></span><span>'+data+'</span><div class="post"><p class="post2">'+testo+'</p></div><button class="btn btn-block disabled" style="margin-bottom:0;"><b>Qualit&agrave;</b> '+quality+'</button><button class="btn btn-block disabled" style="margin-bottom:0;"><b>Affidabilit&agrave;</b> '+reliability+'</button><button class="btn btn-block disabled" style="margin-bottom:0;"><b>Gentilezza</b> '+kindness+'</button></div>'); 
		    
		});
	}		//chiude if checkVuoto
}

function errorLogout(){
	alert("Server error");
}

/*
 * FUNZIONI PER INSERIRE UN NUOVO COMMENTO (PAGINA COMMENTO-NUOVO.HTML)
 */
function inviaNuovoCommento(){
	$('#loading').fadeIn('fast');			//schermata di caricamento
	
	commentTitle = $('#commentTitle').val();
	commentText = $('#commentText').val();
	qualityRating = $('#qualityRating').val();
	reliabilityRating = $('#reliabilityRating').val();
	kindnessRating = $('#kindnessRating').val();
	
	alert(commentTitle+" "+commentText+" "+qualityRating+" "+reliabilityRating+" "+kindnessRating);
	
	$.ajax({
        type: 'GET',
        url: 'http://95.141.45.174/insertcoment',
        contentType: 'application/x-www-form-urlencoded',
        data: {'comment': commentText, 'title': commentTitle, 'qualityRating': qualityRating, 'reliabilityRating': reliabilityRating, 'kindnessRating': kindnessRating, 'jobid': sessionStorage.id},
        crossDomain: true,
        complete: function(){$('#loading').fadeOut('fast')},		//nasconde la schermata di caricamento
        success: function(){window.location='intervento-concluso.html'},
        error: errorHandler
     })
}