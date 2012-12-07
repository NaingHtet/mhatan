$(document).ready(function(){
	var ec = new EntryController();
	var pc = new PicController();
	
	ec.fetchData('/prevdayentry','tomorrow',function(data){
		ec.printData_day(data);
	});
	ec.fetchData('/prevmonthentry','today',function(data){
		ec.printData_month(data);
	});
	ec.fetchData('/prevyearentry','today',function(data){
		ec.printData_year(data);
	});

	$('input[name="entry_type"]:radio').change(function(){
		changeType($('input[name="entry_type"]:checked').val());
	});

	$('#btn-pic').click(function(){
		$('#add-pictures').modal("show");
		//$('#add-pictures').show();
	});

	$('#add-btn').click(function(){
		pc.addPic($('#imgurl-tf').val());
		printPic();
	});

	$('#prevday').click(function(){
		ec.fetchData('/prevdayentry',$('#currentday').html(),function(data){
			ec.printData_day(data);
		});
	});

	$('#nextday').click(function(){
		ec.fetchData('/nextdayentry',$('#currentday').html(),function(data){
			ec.printData_day(data);
		});
	});
	$('#prevmonth').click(function(){
		ec.fetchData('/prevmonthentry',$('#currentmonth').html(),function(data){
			ec.printData_month(data);
		});
	});

	$('#nextmonth').click(function(){
		ec.fetchData('/nextmonthentry',$('#currentmonth').html(),function(data){
			ec.printData_month(data);
		});
	});
	$('#prevyear').click(function(){
		ec.fetchData('/prevyearentry',$('#currentyear').html(),function(data){
			ec.printData_year(data);
		});
	});

	$('#nextyear').click(function(){
		ec.fetchData('/nextyearentry',$('#currentyear').html(),function(data){
			ec.printData_year(data);
		});
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
