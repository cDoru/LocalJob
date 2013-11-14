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
				  '<a class="navbar-brand" href="javascript:history.go(-1);"><span class="glyphicon glyphicon-chevron-left"></span> <img src="img/minilogo.png"/></a>'+
				'</div>'+
				'<div class="navbar-collapse collapse">'+
				  '<ul class="nav navbar-nav">'+
					'<li class="active"><a href="#">Chi sei?</a></li>'+
				  '</ul>'+
				  '<ul class="nav navbar-nav navbar-right">'+
					'<li><a href="../navbar/">...</a></li>'+
					'<li><a href="../navbar/">...</a></li>'+
					'<!--<li class="active"><a href="./">Fixed top</a></li>-->'+
				  '</ul>'+
				'</div><!--/.nav-collapse -->'+
			  '</div>'+
			'</div>');
}

