/* ENTRY.JS
 * Handles javascript for entries
 */
$(document).ready(function(){
	var ec = new EntryController();
	var pc = new PicController();
	changeType('T');
	//Fetch data for daily entry tab and display
	ec.fetchData('/prevdayentry','tomorrow',function(data){
		if(data == ''){
			ec.fetchData('/nextdayentry','yesterday',function(data){
				if(data == ''){
					$('#entries_day').html('No entries. Please write some entries first.');
				}else{
					ec.printData_day(data);
				}
			});
		}else{
			ec.printData_day(data);
		}
	});

	//Fetch data for monthly entry tab and display
	ec.fetchData('/prevmonthentry','today',function(data){
		if(data ==''){
			ec.fetchData('/nextmonthentry','today',function(data){
				if(data==''){
					$('#entries_month').html('No entries. Please write some entries first.');
				}else{
					ec.printData_month(data);
				}
			});
		}else{
			ec.printData_month(data);
		}
	});

	//Fetch data for yearly entry tab and display
	ec.fetchData('/prevyearentry','today',function(data){
		if(data == ''){
			ec.fetchData('/nextyearentry','today',function(data){
				if(data==''){
					$('#entries_year').html('No entries. Please write some entries first.');
				}else{
					ec.printData_year(data);
				}
			});
		}else{
			ec.printData_year(data);
		}
	});

//Setting up buttons and linking them to their functions
	$('input[name="entry_type"]:radio').change(function(){
		changeType($('input[name="entry_type"]:checked').val());
	});

	$('#btn-pic').click(function(){
		$('#add-pictures').modal("show");
	});

	$('#add-btn').click(function(){
		pc.addPic($('#imgurl-tf').val());
		printPic();
	});

	$('#prevday').click(function(){
		ec.fetchData('/prevdayentry',$('#currentday').html(),function(data){
			if(!data){
				$('#entries_day').html('No entries. Please write some entries first.');
			}else{
				ec.printData_day(data);
			}
		});
	});

	$('#nextday').click(function(){
		ec.fetchData('/nextdayentry',$('#currentday').html(),function(data){
			if(!data){
				$('#entries_day').html('No entries. Please write some entries first.');
			}else{
				ec.printData_day(data);
			}
		});
	});
	$('#prevmonth').click(function(){
		ec.fetchData('/prevmonthentry',$('#currentmonth').html(),function(data){
			if(!data){
				$('#entries_month').html('No entries. Please write some entries first.');
			}else{
				ec.printData_month(data);
			}
		});
	});

	$('#nextmonth').click(function(){
		ec.fetchData('/nextmonthentry',$('#currentmonth').html(),function(data){
			if(!data){
				$('#entries_month').html('No entries. Please write some entries first.');
			}else{
				ec.printData_month(data);
			}
		});
	});
	$('#prevyear').click(function(){
		ec.fetchData('/prevyearentry',$('#currentyear').html(),function(data){
			if(!data){
				$('#entries_year').html('No entries. Please write some entries first.');
			}else{
				ec.printData_year(data);
			}
		});
	});

	$('#nextyear').click(function(){
		ec.fetchData('/nextyearentry',$('#currentyear').html(),function(data){
			if(!data){
				$('#entries_year').html('No entries. Please write some entries first.');
			}else{
				ec.printData_year(data);
			}
		});
	});
})

//Change the type of the new post
function changeType(entry_type){

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
