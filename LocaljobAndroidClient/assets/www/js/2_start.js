/*
 * Funzioni per: home + gestione login + gestione signin (pro e client)
 */

var user;					//per memorizzare nickname utente
var user_signin_user;		//in user_signin()
var	user_signin_password;	//in user_signin()


//LA SCHERMATA DI LOGIN APPARE IN MODO DINAMICO IN "home.html"
function cambia_login()
{	
	$('#contenitore').html('<h4>Accedi a LocalJob</h4>'+
			'<form class="form-signin" action="javascript:login();">' +
				'<input id="user" type="text" class="input-block-level" placeholder="Username">' +
				'<input id="password" type="password" class="input-block-level" placeholder="Password">' +
				'<div class="btn-toolbar" style="margin: 0;">'+
					'<span align="center">'+
						'<button class="btn btn-large btn-inverse" type="button" onclick="location.reload();" style="width:28%;margin:0 2% 0 0">' +
							'<img src="./img/glyphicons/white_ver/225.PNG" style="height:15px;margin-top:-5px">'+
						'</button>' +
						'<button class="btn btn-large btn-inverse" type="submit" style="width:70%;">Accedi</button>'+
					'</span>' +
				'</div>'+
				'<div align="center" id="password_link"><a href="#">Hai dimenticato la password?</a></div>'+
			'</form>');
}

//GESTIONE DEL LOGIN CLASSICO
function login()
{
	$('#loading').fadeIn('fast');
	user =  $('#user').val(); 
	password =  $('#password').val(); 
	$.ajax({
          type: 'POST',
          url: 'http://95.141.45.174/login/',
          contentType: 'application/x-www-form-urlencoded',
          crossDomain: true,
          data: {'userId': user, 'password': password, 'googlecod': sessionStorage.googlecod},
          complete: function(){$('#loading').fadeOut('fast')},
          success: ajaxLOGIN,
          error: errorHandler
       });
}
function ajaxLOGIN(data)
{
	if(data == "cliente" || data == "professionista")
	{	
		localStorage.userType = data;
		localStorage.logged = true;
		localStorage.nickname = user;
		window.location='interventi-attivi.html';		
	}
	else{
		alert("User o Password errati");
	}
}

//GESTIONE DEL LOGIN VIA FACEBOOK
function facebook_login()
{
	$('#loading').fadeIn('fast');
	$.ajax({
        type: 'GET',
        url: 'http://95.141.45.174/login/facebook/',
        contentType: 'application/x-www-form-urlencoded',
        crossDomain: true,
        complete: function(){$('#loading').fadeOut('fast')},
        success: ajaxLOGINFB,
        error: errorHandler
     })
}
function ajaxLOGINFB(data){
	if(data == "")
	{
		window.location='interventi-attivi.html';
	}
	else
	{
		alert("User o Password errati");
	}
}

//REGISTRAZIONE CON FACEBOOK
function AccediFB()
{
		my_window=window.open('http://95.141.45.174/logwhitface?googlecod='+sessionStorage.googlecod, 'my_window', 'location=yes');
		$("#bottone_entra_fb").removeAttr("disabled");
}
//ACCESSO CON FACEBOOK (DOPO CHE LA REGISTRAZIONE E' STATA FATTA)
function EntraFB()
{		
	localStorage.userType = 'cliente';
	localStorage.logged = true;
	window.location='interventi-attivi.html';
}


//REGISTRAZIONE NUOVO UTENTE
function user_signin()
{
	$('#loading').fadeIn('fast');
	
	tipoUtente = "cliente";
	user =  $('#signU_user').val(); 
	password =  $('#signU_password2').val();
	mail =  $('#signU_mail').val();
	
	user_signin_user = user;
	user_signin_password = password;
	
	 $.ajax({
	          type: 'POST',
	          url: 'http://95.141.45.174/register',
	          contentType: 'application/x-www-form-urlencoded',
	          crossDomain: true,
	          data: {'userId': user, 'password': password, 'email': mail, 'userType': tipoUtente},
	          success: ajaxSIGNIN,
	          error: errorHandler
	})
}
//COMPLETATA LA REGISTRAZIONE, L'UTENTE ACCEDE AUTOMATICAMENTE
function ajaxSIGNIN(data)
{
	$.ajax({
          type: 'POST',
          url: 'http://95.141.45.174/login/',
          contentType: 'application/x-www-form-urlencoded',
          crossDomain: true,
          data: {'userId': user_signin_user, 'password': user_signin_password, 'googlecod': sessionStorage.googlecod},
          complete: function(){$('#loading').fadeOut('fast')},
          success: ajaxLOGIN,
          error: errorHandler
       });
}

/*
//Registrazione Professionista
function pro_signin()
{
	$('#loading').fadeIn('fast');
	
	tipoUtente = "professionista";
	user =  $('#signP_user').val(); 
	password =  $('#signP_password2').val();
	mail =  $('#signP_mail').val();
	
	$.ajax({
        type: 'POST',
        url: 'http://95.141.45.174/register',
        //contentType:"application/json",
        //dataType:'jsonp',
        contentType: 'application/x-www-form-urlencoded',
        crossDomain: true,
        data: {'userId': user, 'password': password, 'email': mail, 'tipoUtente': tipoUtente},
        success: ajaxSIGNIN,
        error: errorHandler
	})
}
*/