$(document).ready(function()	//funzioni che si avviano al caricamento della pagina
{
	jQuery.support.cors = true;
});


function login()	//gestisce il login dell'utente
{
	//alert("prova!");
	user =  $('#user').val(); 
	password =  $('#password').val(); 
	alert("user: "+ user + " e password: " + password);
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
	password1 =  $('#signU_password1').val();
	password2 =  $('#signU_password2').val();
	mail =  $('signU_mail').val();
	tipoUtente = "cliente";
	
	if(password1 != password2){
		alert("Le due password sono diverse");
	}
	else 
	//fai il controllo che sia inserita una mail corretta
	//if
	//else
	{
		$.ajax({
	          type: 'POST',
	          url: 'http://95.141.45.174/register',
	          //contentType:"application/json",
	          //dataType:'jsonp',
	          contentType: 'application/x-www-form-urlencoded',
	          crossDomain: true,
	          data: {'userId': user, 'password': password, 'email': mail, 'password': password, 'tipoUtente': tipoUtente},
	          success: ajaxSIGNIN,
	          error: errorHandler
	   })
	}
}

//Registrazione Professionista
function pro_signin()
{
	user =  $('#signP_user').val(); 
	password1 =  $('#signP_password1').val();
	password2 =  $('#signP_password2').val();
	mail =  $('signP_mail').val();
	
	if(password1 != password2){
		alert("Le due password sono diverse");
	}
	else{
		alert("ok");
	}
}


function ajaxLOGIN(data){
	alert(data);
}

function ajaxSIGNIN(data){
	alert(data);
}

function errorHandler(xhr, textStatus, thrownError)		//gestione degli errori
{
   alert(xhr.status);
   alert(thrownError);
}

