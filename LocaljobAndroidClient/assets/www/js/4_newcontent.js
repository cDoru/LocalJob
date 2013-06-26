/* 
 * Funzioni per: nuovo intervento + nuovo commento
 */

//SALVATAGGIO DATI NUOVO INTERVENTO
function saveProblem()
{	
	$('#loading').fadeIn('fast');
	//memorizza in sessionStorage per poterli gestire nelle pagine successive
	problemTitle =  $('#problemTitle').val(); 
	sessionStorage.problemTitle = problemTitle;
	problemDescription =  $('#problemDescription').val();
	sessionStorage.problemDescription = problemDescription;

	//l'utente ha inserito un'immagine? Altrimenti immagine di default
	var imgVal = $('#img_work').val(); 
    if(imgVal=='') 
    { 
    	sessionStorage.problemImg = '/site_media/avatars/132683508668.jpg';
    	window.location='where-are-you.html';
    }
    else
    {
    	//caricamento dell'immagine sul server
    	var oData = new FormData(document.forms.namedItem("fileinfo"));
    	var oReq = new XMLHttpRequest();
    	oReq.open("POST", "http://95.141.45.174/listinterv/", true); 

    	oReq.onload = function(oEvent)
    	{
    		if (oReq.status == 200)
    		{
    			sessionStorage.problemImg = oReq.responseText;
    			$('#loading').fadeOut('fast');
    			window.location='where-are-you.html';
    		}
    		else
    		{
    			oOutput.innerHTML = "Error " + oReq.status + " occurred uploading your file.<br \/>";
    		}
    	};	 
    	oReq.send(oData);
    }	
}
function salvaProblemType(num)
{
	sessionStorage.problemType = num;
}

//INSERIMENTO DI UN NUOVO COMMENTO NELLA PAGINA "commento-nuovo.html"
function inviaNuovoCommento()
{
	$('#loading').fadeIn('fast');
	//estrapola i dati inseriti dall'utente
	commentTitle = $('#commentTitle').val();
	commentText = $('#commentText').val();
	qualityRating = $('input:radio[name=qualityRating]:checked').val();
	reliabilityRating = $('input:radio[name=reliabilityRating]:checked').val();
	kindnessRating = $('input:radio[name=kindnessRating]:checked').val();
	
	//e li invia al server
	$.ajax({
        type: 'POST',
        url: 'http://95.141.45.174/insertcoment',
        contentType: 'application/x-www-form-urlencoded',
        data: {'comment': commentText, 'title': commentTitle, 'qualityRating': qualityRating, 'reliabilityRating': reliabilityRating, 'kindnessRating': kindnessRating, 'jobid': sessionStorage.id},
        crossDomain: true,
        complete: function(){$('#loading').fadeOut('fast')},		//nasconde la schermata di caricamento
        success: function(){window.location='intervento-concluso.html'},
        error: errorHandler
     })
}

//GESTIONE GRAFICA INSERIMENTO DEL RATING
function coloraStelline(tipoRadio, valoreRadio)
{
	switch('' + tipoRadio + valoreRadio + '')
	{
		case 'q1': document.getElementById("img_q1").src="img/starOn.png";
		           document.getElementById("img_q2").src="img/starOff.png";
		           document.getElementById("img_q3").src="img/starOff.png";
		           document.getElementById("img_q4").src="img/starOff.png";
		           document.getElementById("img_q5").src="img/starOff.png";
		           break;
		           
		case 'q2': document.getElementById("img_q1").src="img/starOn.png";
		           document.getElementById("img_q2").src="img/starOn.png";
		           document.getElementById("img_q3").src="img/starOff.png";
		           document.getElementById("img_q4").src="img/starOff.png";
		           document.getElementById("img_q5").src="img/starOff.png";
		           break;
		           
		case 'q3': document.getElementById("img_q1").src="img/starOn.png";
		           document.getElementById("img_q2").src="img/starOn.png";
		           document.getElementById("img_q3").src="img/starOn.png";
		           document.getElementById("img_q4").src="img/starOff.png";
		           document.getElementById("img_q5").src="img/starOff.png";
		           break;
		           
		case 'q4': document.getElementById("img_q1").src="img/starOn.png";
		           document.getElementById("img_q2").src="img/starOn.png";
		           document.getElementById("img_q3").src="img/starOn.png";
		           document.getElementById("img_q4").src="img/starOn.png";
		           document.getElementById("img_q5").src="img/starOff.png";
		           break;
		           
		case 'q5': document.getElementById("img_q1").src="img/starOn.png";
		           document.getElementById("img_q2").src="img/starOn.png";
		           document.getElementById("img_q3").src="img/starOn.png";
		           document.getElementById("img_q4").src="img/starOn.png";
		           document.getElementById("img_q5").src="img/starOn.png";
		           break;
						
		case 'r1': document.getElementById("img_r1").src="img/starOn.png";
		           document.getElementById("img_r2").src="img/starOff.png";
		           document.getElementById("img_r3").src="img/starOff.png";
		           document.getElementById("img_r4").src="img/starOff.png";
		           document.getElementById("img_r5").src="img/starOff.png";
		           break;
						
		case 'r2': document.getElementById("img_r1").src="img/starOn.png";
		           document.getElementById("img_r2").src="img/starOn.png";
		           document.getElementById("img_r3").src="img/starOff.png";
		           document.getElementById("img_r4").src="img/starOff.png";
		           document.getElementById("img_r5").src="img/starOff.png";
		           break;
						
		case 'r3': document.getElementById("img_r1").src="img/starOn.png";
		           document.getElementById("img_r2").src="img/starOn.png";
		           document.getElementById("img_r3").src="img/starOn.png";
		           document.getElementById("img_r4").src="img/starOff.png";
		           document.getElementById("img_r5").src="img/starOff.png";
		           break;
						
		case 'r4': document.getElementById("img_r1").src="img/starOn.png";
		           document.getElementById("img_r2").src="img/starOn.png";
		           document.getElementById("img_r3").src="img/starOn.png";
		           document.getElementById("img_r4").src="img/starOn.png";
		           document.getElementById("img_r5").src="img/starOff.png";
		           break;
						
		case 'r5': document.getElementById("img_r1").src="img/starOn.png";
		           document.getElementById("img_r2").src="img/starOn.png";
		           document.getElementById("img_r3").src="img/starOn.png";
		           document.getElementById("img_r4").src="img/starOn.png";
		           document.getElementById("img_r5").src="img/starOn.png";
		           break;
						
		case 'k1': document.getElementById("img_k1").src="img/starOn.png";
		           document.getElementById("img_k2").src="img/starOff.png";
		           document.getElementById("img_k3").src="img/starOff.png";
		           document.getElementById("img_k4").src="img/starOff.png";
		           document.getElementById("img_k5").src="img/starOff.png";
		           break;
						
		case 'k2': document.getElementById("img_k1").src="img/starOn.png";
		           document.getElementById("img_k2").src="img/starOn.png";
		           document.getElementById("img_k3").src="img/starOff.png";
		           document.getElementById("img_k4").src="img/starOff.png";
		           document.getElementById("img_k5").src="img/starOff.png";
		           break;
						
		case 'k3': document.getElementById("img_k1").src="img/starOn.png";
		           document.getElementById("img_k2").src="img/starOn.png";
		           document.getElementById("img_k3").src="img/starOn.png";
		           document.getElementById("img_k4").src="img/starOff.png";
		           document.getElementById("img_k5").src="img/starOff.png";
		           break;
						
		case 'k4': document.getElementById("img_k1").src="img/starOn.png";
		           document.getElementById("img_k2").src="img/starOn.png";
		           document.getElementById("img_k3").src="img/starOn.png";
		           document.getElementById("img_k4").src="img/starOn.png";
		           document.getElementById("img_k5").src="img/starOff.png";
		           break;
						
		case 'k5': document.getElementById("img_k1").src="img/starOn.png";
		           document.getElementById("img_k2").src="img/starOn.png";
		           document.getElementById("img_k3").src="img/starOn.png";
		           document.getElementById("img_k4").src="img/starOn.png";
		           document.getElementById("img_k5").src="img/starOn.png";
		           break;											
	    }
}