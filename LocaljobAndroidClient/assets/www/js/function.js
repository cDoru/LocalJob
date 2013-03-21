$(document).ready(function()	//funzioni che si avviano al caricamento della pagina
{
	jQuery.support.cors = true;
	
	//roba per la validazione email
	$('#contact-form').validate(
	{
	rules: {
		 signP_user: {
			 minlength: 2,
			 maxlength: 30,
			 required: true
		 },
		 signP_mail: {
			 required: true,
			 email: true
		 },
		 password: {
		     minlength: 8,
		     required: true
		},
		signP_password2: {
			minlength: 8,
			equalTo: "#password",
		    required: true
	    },
		signU_user: {
			 minlength: 2,
			 maxlength: 30,
			 required: true
		 },
		 signU_mail: {
			 required: true,
			 email: true
		 },
		signU_password2: {
			minlength: 8,
			equalTo: "#password",
		    required: true
	    }
	},
	highlight: function(element) {
	    $(element).closest('.control-group').removeClass('success').addClass('error');
	},
	success: function(element) {
	    element
	    //.text('OK!').addClass('valid')
	    .closest('.control-group').removeClass('error').addClass('success');
	}
	});
});


/*
 * Funzioni per cambi dinamici pagine
 * 
 * */

function cambia_login(){
	$('#contenitore').html("<form class='form-signin' action='javascript:login();'>" +
			"<input id='user' type='text' class='input-block-level' placeholder='Username'>" +
			"<input id='password' type='password' class='input-block-level' placeholder='Password'>" +
			"<label class='checkbox'><p align='left'><input type='checkbox' value='remember-me'> Remember me</p>" +
			"</label><div align='center'><button class='btn btn-large' type='submit'>Log In</button></div></form>");
}

/*
 * Funzioni chiamate al server
 * 
 * */

function login()	//gestisce il login dell'utente
{
	//alert("prova!");
	user =  $('#user').val(); 
	password =  $('#password').val(); 
	//alert("user: "+ user + " e password: " + password);
	$.ajax({
          type: 'POST',
          url: 'http://95.141.45.174/login',
          //contentType:"application/json",
          //dataType:'jsonp',
          contentType: 'application/x-www-form-urlencoded',
          crossDomain: true,
          data: {'userId': user, 'password': password},
          success: ajaxLOGIN,
          error: errorHandler
       })
}

//Registrazione utente
function user_signin()
{
	user =  $('#signU_user').val(); 
	password =  $('#signU_password2').val();
	mail =  $('#signU_mail').val();
	tipoUtente = "cliente";
	
	//alert("user: "+user+" Password: "+password+" email "+mail+" tipo utente: "+tipoUtente);
	
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

//Registrazione Professionista
function pro_signin()
{
	user =  $('#signP_user').val(); 
	password =  $('#signP_password2').val();
	mail =  $('#signP_mail').val();
	tipoUtente = "professionista";
	
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


function ajaxLOGIN(data){
	//alert(data);
	window.location='interventi-attivi.html';
}

function ajaxSIGNIN(data){
	alert(data);
}

function errorHandler(xhr, textStatus, thrownError)		//gestione degli errori
{
   alert(xhr.status);
   alert(thrownError);
}

