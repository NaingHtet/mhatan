/* ENTRYCONTROLLER.JS
 * Controller for entry page
 */

//Month Listing for translation
var month=new Array();
month[0]="January";
month[1]="February";
month[2]="March";
month[3]="April";
month[4]="May";
month[5]="June";
month[6]="July";
month[7]="August";
month[8]="September";
month[9]="October";
month[10]="November";
month[11]="December";


//Sends request to delete the entry
function deleteEntry(entry_id){
	$.ajax({
		url: '/delentry',
		type: 'POST',
		data: { id: entry_id },
		success: function(data){
			var ec = new EntryController();
			updateAllTabs();
		},
		error: function(jqXHR){
			alert('This is embarassing. We have encountered an error. Please restart the server and report the error.');
			alert(jqXHR.responseText+' :: '+jqXHR.statusText);
		}
	});
}

//Refreshes the entries tab
function updateAllTabs(){
	var ec = new EntryController();
	//Refreshes the daily entry tab
	if($('#currentday').html()!= null){
		var curday = $('#currentday').html().split('.');
		if(curday[1]==31){
			curday[1]=1;
			if(curday[0]==12){curday[0]=1;curday[2]++;}else{curday[2]++;}
		}else{curday[1]++;}
		ec.fetchData('/prevdayentry',curday.join(','),function(udata){
			if(udata == ''){
				ec.fetchData('/nextdayentry',curday.join(','),function(data){
					if(data == ''){
						$('#entries_day').html('No entries. Please write some entries first.');
					}else{
						ec.printData_day(data);
					}
				});
			}else{
				ec.printData_day(udata);
			}
	 	});
	}
	//Refreshes the monthly entry tab
	if($('#currentmonth').html()!=null){
		var curmonth = $('#currentmonth').html().split('.');
		if(curmonth[0]==12){
			curmonth[0]=1;
			curmonth[2]++;
		}else{curmonth[0]++;}
		ec.fetchData('/prevmonthentry',curmonth.join(','),function(udata){
			if(udata ==''){
				ec.fetchData('/nextmonthentry',curmonth.join(','),function(data){
					if(data==''){
						$('#entries_month').html('No entries. Please write some entries first.');
					}else{
						ec.printData_month(data);
					}
				});
			}else{
				ec.printData_month(udata);
			}
		});
	}
	//Refreshes the yearly entry tab
	if($('#currentyear').html()!=null){
		var curyear = $('#currentyear').html().split('.');
		curyear[2]++;
		ec.fetchData('/prevyearentry',curyear.join(','),function(udata){
			if(udata == ''){
				ec.fetchData('/nextyearentry',curyear.join(','),function(data){
					if(data==''){
						$('#entries_year').html('No entries. Please write some entries first.');
					}else{
						ec.printData_year(data);
					}
				});
			}else{
				ec.printData_year(udata);
			}
		});
	}
}
$('#btn-post').click(function(){
	if($('#entry_text-tf').val()!=''){
		e_type = $('input[name="entry_type"]:checked').val();
		e_time = $('#entry_time-tf').val();
		e_date = $('#entry_date-tf').val();
		if( e_type == 'M'){e_date = $('#entry_year-tf').val()+'-'+$('#entry_month-tf').val()+'-31';}
		if( e_type == 'Y'){e_date = $('#entry_year-tf').val()+'-12-31';}
		if( e_type != 'T'){e_time = '23:59';}
		$.ajax({
			url: '/addEntry',
			type: 'POST',
			data: {entry_title:$('#entry_title-tf').val(),
					entry_date:e_date,
					entry_time:e_time,
					entry_text:$('#entry_text-tf').val(),
					entry_type:e_type,
					entry_pics:pics,
					diary_id : $('#diaryId').val()},
			success: function(data){
				var ec = new EntryController();
				if(e_type =='T' || e_type =='D'){
					var curday = e_date.split('-');
					curday[2]++;
					ec.fetchData('/prevdayentry',curday.join('-'),function(udata){
 						ec.printData_day(udata);
						$('#tabs a:first').tab('show');
					});
				}
				if(e_type =='D' || e_type == 'M'){
					var curday = e_date.split('-');
					if(curday[1]==12){
						curday[1]=1;
						curday[0]++;
					}else{curday[1]++;}
					ec.fetchData('/prevmonthentry',curday[0]+'-'+curday[1]+'-01',function(udata){
 						ec.printData_month(udata);
					});
				}
				if(e_type =='Y' || e_type == 'M'){
					var curday = e_date.split('-');
					curday[0]++;
					ec.fetchData('/prevyearentry',curday[0]+'-01-01',function(udata){
 						ec.printData_year(udata);
 						$('#tabs a:last').tab('show');
					});
				}
			},
			error: function(jqXHR){
				alert('This is embarassing. We have encountered an error. Please restart the server and report the error.');
				alert(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}
});

//Displays Entries
function EntryController()
{
	//Fetch the required entries
	this.fetchData= function(furl,date,callback){
		if(date==null){
			callback(null);
		}else{
			$.ajax({
				url: furl,
				type: 'POST',
				data: { user_id: $('#userId').val(),day: date,diary_id: $('#diaryId').val()},
				dataType: "json",
				success: function(data){
					callback(data);
				},
				error: function(jqXHR){
					alert('This is embarassing. We have encountered an error. Please restart the server and report the error.');
					alert(jqXHR.responseText+' :: '+jqXHR.statusText);
				}
			});
		}
	}
	//Prints the data in daily entry tab
	this.printData_day= function(data){
		var items=[];
		var curday =data[0].entry_time.split(' ');
		items.push("<h2 id='currentday'>"+curday[0]+"</h2>")
		for (var i = 0; i < data.length; i++){
			var time = data[i].entry_time.split(' ');
			var btn_html = '<button class="btn btn-mini" onclick="deleteEntry('+data[i].entry_id+')"><i class="icon-remove"></i></button>';
			var title = (data[i].title==null) ?'':data[i].title;
			var timetitle = (data[i].entry_type=='D')?'<h4>'+title+'</h4>':'<h5>'+time[1]+'  :  '+title+'</h5>';
			var pichtml = '';
			if(data[i].pic_list != null){
				var pics = data[i].pic_list.split(',');
				pics[0] = pics[0].slice(1,pics[0].length);
				pics[pics.length-1]=pics[pics.length-1].slice(0,-1);
				pichtml = '<div class=pictures>';
				for(var x=0; x<pics.length; x++){
					pichtml+='<img src="'+ pics[x]+'">';
				}
				pichtml+= '</div>';
			}
			items.push('<p>'+timetitle+btn_html+'<p>'+data[i].text_content.replace(/\n\r?/g, '<br />') + pichtml+'</p><hr></p>');
		}
		$('#entries_day').html(items.join(''));
		$('#entries_day').focus();
	}

	//Prints the data in monthly entry tab
	this.printData_month= function(data){
		var items=[];
		var curday =data[0].entry_time.split(' ');
		var curmonth = curday[0].split('.');
		items.push("<h2 hidden='true' id='currentmonth'>"+curmonth[0]+'.1.'+curmonth[2]+"</h2>");
		items.push("<h2>"+month[curmonth[0]-1]+' '+curmonth[2]+"</h2>");
		for (var i = 0; i < data.length; i++){
			var time = data[i].entry_time.split(' ');
			var time_day = time[0].split('.');
			var btn_html = '<button class="btn btn-mini" onclick="deleteEntry('+data[i].entry_id+')"><i class="icon-remove"></i></button>';
			var title = (data[i].title==null) ?'':data[i].title;
			var timetitle = (data[i].entry_type=='M')?'<h3>'+title+'</h3>':'<h4>Day&nbsp;&nbsp;&nbsp;&nbsp;'+time_day[1]+'  :  '+title+'</h4>';
			var pichtml = '';
			if(data[i].pic_list != null){
				var pics = data[i].pic_list.split(',');
				pics[0] = pics[0].slice(1,pics[0].length);
				pics[pics.length-1]=pics[pics.length-1].slice(0,-1);
				pichtml = '<div class=pictures>';
				for(var x=0; x<pics.length; x++){
					pichtml+='<img src="'+ pics[x]+'">';
				}
				pichtml+= '</div>';
			}
			items.push('<p>'+timetitle+btn_html+'<p>'+data[i].text_content.replace(/\n\r?/g, '<br />') + pichtml+'</p><hr></p>');
		}
		$('#entries_month').html(items.join(''));
		$('#entries_month').focus();
	}

	//Prints the data in yearly entry tab
	this.printData_year= function(data){
		var items=[];
		var curday =data[0].entry_time.split(' ');
		var curmonth = curday[0].split('.');
		items.push("<h2 hidden='true' id='currentyear'>"+'1.1.'+curmonth[2]+"</h2>");
		items.push("<h2>"+curmonth[2]+"</h2>");
		for (var i = 0; i < data.length; i++){
			var time = data[i].entry_time.split(' ');
			var time_day = time[0].split('.');
			var btn_html = '<button class="btn btn-mini" onclick="deleteEntry('+data[i].entry_id+')"><i class="icon-remove"></i></button>';
			var title = (data[i].title==null) ?'':data[i].title;
			var timetitle = (data[i].entry_type=='Y')?'<h3>'+title+'</h3>':'<h4>'+month[time_day[0]-1]+'  :  '+title+'</h4>';
			var pichtml = '';
			if(data[i].pic_list != null){
				var pics = data[i].pic_list.split(',');
				pics[0] = pics[0].slice(1,pics[0].length);
				pics[pics.length-1]=pics[pics.length-1].slice(0,-1);
				pichtml = '<div class=pictures>';
				for(var x=0; x<pics.length; x++){
					pichtml+='<img src="'+ pics[x]+'">';
				}
				pichtml+= '</div>';
			}
			items.push('<p>'+timetitle+btn_html+'<p>'+data[i].text_content.replace(/\n\r?/g, '<br />') + pichtml+'</p><hr></p>');
		}
		$('#entries_year').html(items.join(''));
		$('#entries_year').focus();
	}

}