var pushNotification;
var googlecod;

function onDeviceReady() {	
	    
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

// handle APNS notifications for iOS
function onNotificationAPN(e) {
    if (e.alert) {
         navigator.notification.alert(e.alert);
    }
        
    if (e.sound) {
        var snd = new Media(e.sound);
        snd.play();
    }
    
    if (e.badge) {
        pushNotification.setApplicationIconBadgeNumber(successHandler, e.badge);
    }
}

// handle GCM notifications for Android
function onNotificationGCM(e) {
   //alert(e.event);
    
    switch( e.event )
    {
       case 'registered':
		if ( e.regid.length > 0 )
		{
			// Your GCM push server needs to know the regID before it can push to this device
			// here is where you might want to send it the regID for later use.
			console.log("regID = " + e.regID);
			googlecod = e.regid;
		}
		
        break;   
        
        case 'message':
        	// if this flag is set, this notification happened while we were in the foreground.
        	// you might want to play a sound to get the user's attention, throw up a dialog, etc.
        	
        	/*
        	if (e.foreground)
        	{				
				alert("fore: "+e.payload.prova);
			}
			else
			{	// otherwise we were launched because the user touched a notification in the notification tray.
				if (e.coldstart) {
					alert("cold: "+e.payload.prova);
				}
				
				else {
					alert("back: "+e.payload.prova);
				}
			}
			*/
        	
			alert('Hai scritto: ' + e.payload.message);
			
        break;
        
        case 'error':
			alert(e.msg);
        break;
        
        default:
			alert('EVENT -> Unknown, an event was received and we do not know what it is');
        break;
    }
}

function tokenHandler (result) {
    alert('token: '+ result);
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
}

function successHandler (result) {
    //alert('success:'+ result);
}

function errorHandler (error) {
    alert('error:'+ error);
}

document.addEventListener('deviceready', onDeviceReady, true);
