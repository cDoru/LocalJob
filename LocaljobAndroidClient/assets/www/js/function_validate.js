$(document).ready(function()	//funzioni che si avviano al caricamento della pagina
{
	jQuery.support.cors = true;
	
	//script per il form della data di nascita
	var firstYear = 1920;
	var lastYear = 1999;
	for(var i =firstYear; i<=lastYear; i++) {
	       $('#anni').append('<option>'+i+'</option>');
	}
	
	
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
	    },
		 signU_name: {
			 required: true
			 //digits: true
		 },
		 signU_surname: {
			 required: true
			 //digits: true
		 },
		 signU_phone: {
			 required: false,
			 number: true
		 }
	},
	highlight: function(element) {
	    $(element).closest('.control-group').removeClass('success').addClass('error');
		$(element).closest('.control-group').addClass('error');
	},
	success: function(element) {
	    element
	    //.text('OK!').addClass('valid')
	    .closest('.control-group').removeClass('error').addClass('success');
	}
	});	
});

//function getImgForm(){}


