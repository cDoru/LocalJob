/*
 * funzioni che si avviano al caricamento della pagina
 */

document.addEventListener('deviceready', partenza, true);

function partenza(){
	
	jQuery.support.cors = true;
	
	//prova di cavo:
	/*
	if(localStorage.notificaSalvata == null){
		
	}
	else{
		elaboraNotifica(e.payload);
	}
	*/

	//roba per il tooltip (notifiche)
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
	//window.addEventListener("orientationchange", orientationChange, true);

	// Listen for orientation changes
	window.addEventListener("orientationchange", function() {
  		
  		// Announce the new orientation number
  		//alert('Orientation ' + window.orientation);

  		if(window.orientation == 0) {
  			// Non sono nella mappa, quindi non faccio niente
        //if(!(location.href).indexOf("map-landscape") == -1) {
          //history.back();
          location.href = 'interventi-attivi.html';
        //}
  		}
  		if(window.orientation == 90) {
  			//alert('Orientation 0, sono storto verso sinistra (landscape)');
        location.href = 'map-landscape.html';
  		}
  		if(window.orientation == -90) {
			  //alert('Orientation 0, sono storto verso destra (landscape)');
        location.href = 'map-landscape.html';
  		}

	}, false);
	
}

