/*
 * funzioni che si avviano al caricamento della pagina
 */
$(document).ready(function(){
	
	jQuery.support.cors = true;

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
  			alert('Orientation 0, sono dritto (portrait)');
  		}
  		if(window.orientation == 90) {
  			alert('Orientation 0, sono storto verso sinistra (landscape)');
  		}
  		if(window.orientation == -90) {
			alert('Orientation 0, sono storto verso destra (landscape)');
  		}

	}, false);
	
});

