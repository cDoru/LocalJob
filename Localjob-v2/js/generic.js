function bar1Insert() {
	$('#bar').html('<!-- Fixed navbar -->'+
			'<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">'+
			  '<div class="container">'+
				'<div class="navbar-header">'+
				  '<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">'+
					'<span class="sr-only">Toggle navigation</span>'+
					'<span class="icon-bar"></span>'+
					'<span class="icon-bar"></span>'+
					'<span class="icon-bar"></span>'+
				  '</button>'+
				  '<a class="navbar-brand" href="javascript:history.go(-1);"><img src="img/minilogo.png"/></a>'+
				'</div>'+
				'<div class="navbar-collapse collapse">'+
				  '<ul class="nav navbar-nav">'+
					'<li class="active"><a href="#">Registrazione</a></li>'+
				  '</ul>'+
				  '<ul class="nav navbar-nav navbar-right">'+
					'<li><a href="../navbar/">Indietro</a></li>'+
					'<!--<li class="active"><a href="./">Fixed top</a></li>-->'+
				  '</ul>'+
				'</div><!--/.nav-collapse -->'+
			  '</div>'+
			'</div>');
}
function showInfo(){
	$('#infoLJ').modal('show');
}

