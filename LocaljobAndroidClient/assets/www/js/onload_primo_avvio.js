/*
 * funzioni che si avviano al caricamento della pagina
 */

var pushNotification;

$(document).ready(function(){
	
	jQuery.support.cors = true;
	
	/*
	 * Parte per la registrazione del dispositivo sui server di google (per le notifiche)
	 */
	
});

document.addEventListener('deviceready', onDeviceReady, true);

function onDeviceReady() {	
	
	if(localStorage.nickname){		
		window.location='interventi-attivi.html';
	}
	else{
		
		/*
		document.addEventListener("backbutton", function(e)	{
				
				if( $("#home").length > 0)
			{
				// call this to get a new token each time. don't call it to reuse existing token.
				//pushNotification.unregister(successHandler, errorHandler);
				e.preventDefault();
				navigator.app.exitApp();
			}
			else
			{
				navigator.app.backHistory();
			}
		}, false); 
		 */

		try 
		{ 
	    	pushNotification = window.plugins.pushNotification;
	    	if (device.platform == 'android' || device.platform == 'Android') {
	        	pushNotification.register(successHandler, errorHandler, {"senderID":"561085796124","ecb":"onNotificationGCM"});		// required!
			} else {
	        	pushNotification.register(tokenHandler, errorHandler, {"badge":"true","sound":"true","alert":"true","ecb":"onNotificationAPN"});	// required!
	    	}
	    }
		catch(err) 
		{ 
			txt="There was an error on this page.\n\n"; 
			txt+="Error description: " + err.message + "\n\n"; 
			alert(txt); 
		} 
		
	}
    
	
}

function tokenHandler (result) {
    alert('token: '+ result);
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
}

function successHandler (result) {
    //alert('success:'+ result);
	//window.location='home.html';
}

function errorHandler (error) {
    alert('error:'+ error);
}