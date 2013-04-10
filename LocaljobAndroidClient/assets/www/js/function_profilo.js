//funzioni della pagina "profilo-professionista". Da inserire nel file function principale

var cliccato = false;	//per sapere se il bottone "commenti" è già stato cliccato o no
var q = 1;				//per inserire la qualità
var r = 2;				//per inserire l'affidabilità
var k = 3;				//per inserire la gentilezza

function showCommentList(){		//mostra i commenti - pagina profilo professionista
	if(cliccato){
		$('#commentList').hide();
		$('#icoBottone').attr('class', 'icon-chevron-down icon-white');
		
		cliccato = false;
	}else{
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
	latitudine = $(xmlString).find("latitude").text();				//serve altrove
	longitudine = $(xmlString).find("longitude").text();			//serve altrove
	//indirizzo = $(xmlString).find("indirizzo").text();
	//ragioneSociale = $(xmlString).find("ragioneSociale").text();
	costService = $(xmlString).find("costService").text();
	costoOrario = $(xmlString).find("costPerHour").text();
	quality = $(xmlString).find("qualityRating").text();
	reliability = $(xmlString).find("reliabilityRating").text();
	kindness = $(xmlString).find("kindnessRating").text();
	avatar = $(xmlString).find("avatarPath").text();
	//telefono = $(xmlString).find("numTelefono").text();
	
	$('#nome').html(nome + ' ');
	$('#cognome').html(cognome);
	$('#descrizione').html(descrizione);
	$('#costoChiamata').html(costService + ' euro');
	$('#costoOrario').html(costoOrario + ' euro');
	$('#avatar').attr('src', avatar);
	
	//alert("alert 1:" + quality);
	rating(quality, q);			//qualità è 1
	rating(reliability, r);		//affidabilità è 2
	rating(kindness, k);		//gentilezza è 3
}

function rating(voto, categoria){			//per visualizzare le valutazioni
	var arrotondato = Math.round(voto);
	//stelle grandi
	//var stellaVuota = "<img src='./img/glyphicons/black_ver/glyphicons_048_dislikes.png' />";
	//var stellaPiena = "<img src='./img/glyphicons/black_ver/glyphicons_049_star.png' />";
	
	//stelle piccole
	var stellaVuota = "<i class='icon-star-empty'></i>";
	var stellaPiena = "<i class='icon-star'></i>";
	
	//alert("alert 2:" + arrotondato);
	
	switch(arrotondato) {
    case 0: stelle =  stellaVuota + stellaVuota + stellaVuota + stellaVuota + stellaVuota + ' (0/5)'; break;
    case 1: stelle =  stellaPiena + stellaVuota + stellaVuota + stellaVuota + stellaVuota + ' (1/5)'; break;
    case 2: stelle =  stellaPiena + stellaPiena + stellaVuota + stellaVuota + stellaVuota + ' (2/5)'; break;
    case 3: stelle =  stellaPiena + stellaPiena + stellaPiena + stellaVuota + stellaVuota + ' (3/5)'; break;
    case 4: stelle =  stellaPiena + stellaPiena + stellaPiena + stellaPiena + stellaVuota + ' (4/5)'; break;
    case 5: stelle =  stellaPiena + stellaPiena + stellaPiena + stellaPiena + stellaPiena + ' (5/5)'; break;
    }
	
	//alert("alert 3:" + stelle);
	
	switch(categoria) {
    case 1: $('#quality').html(stelle); break;
    case 2: $('#reliability').html(stelle); break;
    case 3: $('#kindness').html(stelle); break;
    }
}

function errorLogout(){
	alert("qualcosa è andato storto");
}