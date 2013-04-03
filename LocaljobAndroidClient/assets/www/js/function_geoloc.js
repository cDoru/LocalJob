var id_watch = null;

$(document).ready(function()	//funzioni che si avviano al caricamento della pagina
{
	jQuery.support.cors = true;
	
	function(){ 
	    id_watch = navigator.geolocation.watchPosition(inCasoDiSuccesso);
	}
	
});


inCasoDiSuccesso = function(position){ 
	document.getElementById("posizione_corrente").insertAdjacentHTML('beforeend',
    "<li> Lat: " + position.coords.latitude + ", Lon: " + position.coords.longitude + );
    "</li>"
    );
}
   
sospendiLaRicezione = function(){ 
	navigator.geolocation.clearWatch(id_watch);
}

