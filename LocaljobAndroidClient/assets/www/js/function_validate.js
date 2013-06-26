//AL CARICAMENTO DELLA PAGINA
$(document).ready(function()
{
	jQuery.support.cors = true;
	
	//per la validazione dell'email
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
	    .closest('.control-group').removeClass('error').addClass('success');
	}
	});	
});