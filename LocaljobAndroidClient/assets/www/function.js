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



function ajaxLOGIN(data){
	alert(data);
}

function errorHandler(xhr, textStatus, thrownError)		//gestione degli errori
{
   alert(xhr.status);
   alert(thrownError);
}

