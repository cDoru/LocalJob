/* 
 * Funzioni per: where-are-you.html
 */

var position_lat;			//latitudine geolocalizzata
var position_long;			//longitudine geolocalizzata
var geocoder;				//maps
var xml_case;				//xml ricevuto
var controller_geolocation;		//serve per la geolocalizzazione
var map;					//per mappe leaflet
cloudmadeAttrib = 'Data, imagery and map information provided by <a href="http://open.mapquest.co.uk" target="_blank">MapQuest</a>, <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> and contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/" target="_blank">CC-BY-SA</a>';

/*
 * Inizializza la geolocalizzazione
 */
function initiate_geolocation()
{ 
	//getCurrentPosition rileva la posizione solo una volta
    //navigator.geolocation.getCurrentPosition(handle_geolocation_query,handle_errors);
    navigator.geolocation.getCurrentPosition(handle_geolocation_query,handle_errors, { enableHighAccuracy: true });
}

/*
 * Prende lat e long e mostra la mappa
 */
function handle_geolocation_query(position)
{  		
	position_lat = position.coords.latitude;
	sessionStorage.lat = position_lat;
	position_long = position.coords.longitude;
	sessionStorage.long = position_long;
	
	//se la chiamata proviene da ricercaInZona
	if(controller_geolocation == "ricercaInZona")
	{
		ricercaInZona(sessionStorage.filtroPrecedente, "");
	}
	else
	{
		initialize_map("altro", position_lat, position_long);	
		//usa le Google API per derivare le altre informazioni
		codeLatLng(position_lat, position_long);
	}
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

/*
 * Mostra la mappa (con LeafLet)
 */
function initialize_map(tipo, lat, long)
{		
	map = L.map('map', {
	    center: [lat, long],
	    zoom: 16
		});
		
		L.tileLayer('http://otile4.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
				maxZoom: 19, attribution: cloudmadeAttrib
		}).addTo(map);	
		
	//aggiunge il marker
	localMe = creaPOI(lat,long,"<b>Eccoti!</b><br />Ti ho trovato.");
	//localMe.openPopup();
			
	map.panTo(new L.LatLng(lat, long));
}

function creaPOI(lat,lng, testo) {	
	punto = L.marker([lat, lng]).addTo(map).bindPopup(testo);
	return punto
}

/*
 * Funzione di Reverse Geocoding (Usando le API di Google)
 */
function codeLatLng(position_lat, position_long)
{
	alert("entra nel geocoding");
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
	    	$('#via').attr('value',indirizzo);
	    	$('#civico').attr('value',nciv);
	    	$('#cap').attr('value',cap);
	    	$('#citta').attr('value',citta);
	    	$('#prov').attr('value',provincia);
	    }
	    else
	    {
	      alert('Geocoder failed due to: ' + status);
	    }
	  });
}
