$(document).ready(function(){
	var ec = new EntryController();
	
	ec.fetchData(function(data){
		ec.printData(data);
	});

	$('input[name="entry_type"]:radio').change(function(){
		changeType($('input[name="entry_type"]:checked').val());
	});

})

function changeType(entry_type){
	//$('.modal-confirm').modal('hide');

	if(entry_type!='D'){
		$('#entry_date-tf').hide('1');
	}else{
		$('#entry_date-tf').show('1');
		$('#entry_prompt').fadeOut(500,function(){$(this).text('Write Something About Today!').fadeIn(500);});
	}
	if(entry_type!='T'){
		$('#entry_time-tf').hide('1');
	}else{
		$('#entry_time-tf').show('1');
		$('#entry_date-tf').show('1');
		$('#entry_prompt').fadeOut(500,function(){$(this).text('Write Something!').fadeIn(500);});
	}
	if(entry_type !='Y'){
		$('#entry_year-tf').hide('1');
	}else{
		$('#entry_year-tf').show('1');
		$('#entry_prompt').fadeOut(500,function(){$(this).text('Write Something About This Year!').fadeIn(500);});
	}
	if(entry_type !='M'){
		$('#entry_month-tf').hide('1');
	}else{
		$('#entry_month-tf').show('1');
		$('#entry_year-tf').show('1');
		$('#entry_prompt').fadeOut(500,function(){$(this).text('Write Something About This Month!').fadeIn(500);});
	}
}
