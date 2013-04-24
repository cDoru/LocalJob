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
	//$(window).bind('orientationchange', orientationChange);
	
});

