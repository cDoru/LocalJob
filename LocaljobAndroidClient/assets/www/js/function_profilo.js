var cliccato = false;	//per sapere se il bottone commenti in "profilo-professionista" è già stato cliccato o no

//rating: stelle piccole
var stellaVuota = "<i class='icon-star-empty'></i>";
var stellaPiena = "<i class='icon-star'></i>";
//rating: stelle grandi
//var stellaVuota = "<img src='./img/glyphicons/black_ver/glyphicons_048_dislikes.png' />";
//var stellaPiena = "<img src='./img/glyphicons/black_ver/glyphicons_049_star.png' />";

function showCommentList(){		//chiamata ajax + mostra/nasconde i commenti
	if(cliccato){
		$('#commentList').hide();
		$('#icoBottone').attr('class', 'icon-chevron-down icon-white');
		
		cliccato = false;
	}else{
		commentami();
		$('#commentList').show();
		$('#icoBottone').attr('class', 'icon-chevron-up icon-white');
		cliccato = true;
	}
}

function importaDatiProf() {	//richiama i dati del professionista
	$.ajax({
		async: false,
		type: 'GET',
		url: 'http://95.141.45.174/professional/viu/',			
		crossDomain:true,		
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
	badge = $(xmlString).find("badge").text();						//inutilizzato
	latitudine = $(xmlString).find("latitude").text();				//serve altrove?
	longitudine = $(xmlString).find("longitude").text();			//serve altrove?
	costService = $(xmlString).find("costService").text();
	costoOrario = $(xmlString).find("costPerHour").text();
	quality = $(xmlString).find("qualityRating").text();
	reliability = $(xmlString).find("reliabilityRating").text();
	kindness = $(xmlString).find("kindnessRating").text();
	avatar = $(xmlString).find("avatarPath").text();
	//telefono = $(xmlString).find("numTelefono").text();			//queste info le facciamo vedere all'utente?
	//indirizzo = $(xmlString).find("indirizzo").text();
	//ragioneSociale = $(xmlString).find("ragioneSociale").text();
	
	$('#nome').html(nome + ' ');
	$('#cognome').html(cognome);
	$('#descrizione').html(descrizione);
	$('#costoChiamata').html(costService + ' euro');
	$('#costoOrario').html(costoOrario + ' euro');
	
	if(avatar == 'photo' || avatar == '' || avatar.length == 0){
		$('#avatar').attr('src', './img/example_photo.png');
	}
	else{
		$('#avatar').attr('src', avatar);
	}
	
	rating(quality, 1);		//il secondo parametro serve per capire dove mostrare l'info
	rating(reliability, 2);
	rating(kindness, 3);
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

function commentami() {		//richiama i commenti sul professionista
	$.ajax({
		async: false,
		type: 'GET',
		url: 'http://95.141.45.174/professional/viu/comments',			
		crossDomain:true,		
		success: caricaCommenti,
		error: errorLogout
		});		
}

function caricaCommenti(xml) {
	var xmlString = $(xml);	
	$('#commentList').html('');		//azzera la lista commenti prima di caricarli 

	$(xmlString).find("comment").each(function () {		
		var $worker = $(this);
	    nick = $worker.find('nickname').text();
	    testo = $worker.find('text').text();
	    data = $worker.find('date').text();
	    titolo = $worker.find('commentTitle').text();
	    quality = $worker.find('qualityRating').text();
	    reliability = $worker.find('reliabilityRating').text();
	    kindness = $worker.find('kindnessRating').text();
	    
	    //alert(quality);
	    //alert(reliability);
	    //alert(kindness);
	    	
		switch(Math.round(quality)) {
		    case 0: stelle =  stellaVuota + stellaVuota + stellaVuota + stellaVuota + stellaVuota + ' (0/5)'; break;
		    case 1: stelle =  stellaPiena + stellaVuota + stellaVuota + stellaVuota + stellaVuota + ' (1/5)'; break;
		    case 2: stelle =  stellaPiena + stellaPiena + stellaVuota + stellaVuota + stellaVuota + ' (2/5)'; break;
		    case 3: stelle =  stellaPiena + stellaPiena + stellaPiena + stellaVuota + stellaVuota + ' (3/5)'; break;
		    case 4: stelle =  stellaPiena + stellaPiena + stellaPiena + stellaPiena + stellaVuota + ' (4/5)'; break;
		    case 5: stelle =  stellaPiena + stellaPiena + stellaPiena + stellaPiena + stellaPiena + ' (5/5)'; break;
	    }
		quality = stelle;
		
		switch(Math.round(reliability)) {
		    case 0: stelle =  stellaVuota + stellaVuota + stellaVuota + stellaVuota + stellaVuota + ' (0/5)'; break;
		    case 1: stelle =  stellaPiena + stellaVuota + stellaVuota + stellaVuota + stellaVuota + ' (1/5)'; break;
		    case 2: stelle =  stellaPiena + stellaPiena + stellaVuota + stellaVuota + stellaVuota + ' (2/5)'; break;
		    case 3: stelle =  stellaPiena + stellaPiena + stellaPiena + stellaVuota + stellaVuota + ' (3/5)'; break;
		    case 4: stelle =  stellaPiena + stellaPiena + stellaPiena + stellaPiena + stellaVuota + ' (4/5)'; break;
		    case 5: stelle =  stellaPiena + stellaPiena + stellaPiena + stellaPiena + stellaPiena + ' (5/5)'; break;
	    }
		reliability = stelle;
		
		switch(Math.round(kindness)) {
		    case 0: stelle =  stellaVuota + stellaVuota + stellaVuota + stellaVuota + stellaVuota + ' (0/5)'; break;
		    case 1: stelle =  stellaPiena + stellaVuota + stellaVuota + stellaVuota + stellaVuota + ' (1/5)'; break;
		    case 2: stelle =  stellaPiena + stellaPiena + stellaVuota + stellaVuota + stellaVuota + ' (2/5)'; break;
		    case 3: stelle =  stellaPiena + stellaPiena + stellaPiena + stellaVuota + stellaVuota + ' (3/5)'; break;
		    case 4: stelle =  stellaPiena + stellaPiena + stellaPiena + stellaPiena + stellaVuota + ' (4/5)'; break;
		    case 5: stelle =  stellaPiena + stellaPiena + stellaPiena + stellaPiena + stellaPiena + ' (5/5)'; break;
	    }
		kindness = stelle;
	    
	    $('#commentList').append('<div class="commento"><span style="font-weight:bold; display:block;">'+titolo+'</span><span style="margin-right:20px; font-size:0.8em;">'+data+'</span><span style="font-size:0.8em;">DI '+nick+'</span><p style="display:block; text-align:justify;">'+testo+'</p><button class="btn btn-block disabled" style="margin-bottom:0;"><b>Qualit&agrave;</b> '+quality+'</button><button class="btn btn-block disabled" style="margin-bottom:0;"><b>Affidabilit&agrave;</b> '+reliability+'</button><button class="btn btn-block disabled" style="margin-bottom:0;"><b>Gentilezza</b> '+kindness+'</button></div><hr>'); 
	    
	});
}

function errorLogout(){
	alert("qualcosa è andato storto");
}