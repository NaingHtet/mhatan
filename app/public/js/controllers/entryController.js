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

function deleteEntry(entry_id){
	//$('.modal-confirm').modal('hide');
	$.ajax({
		url: '/delentry',
		type: 'POST',
		data: { id: entry_id },
		success: function(data){
			var ec = new EntryController();
			var curday = $('#currentday').html().split('.');
			curday[1]++;
			ec.fetchData('/prevdayentry',curday.join(','),function(udata){
 				ec.printData_day(udata);
			});
		},
		error: function(jqXHR){
			alert(jqXHR.responseText+' :: '+jqXHR.statusText);
		}
	});
}
$('#btn-post').click(function(){
	if($('#entry_text-tf').val()!=''){
		e_type = $('input[name="entry_type"]:checked').val();
		e_time = $('#entry_time-tf').val();
		e_date = $('#entry_date-tf').val();
		if( e_type == 'M'){e_date = $('#entry_month-tf').val()+'-31-'+$('#entry_year-tf').val();}
		if( e_type == 'Y'){e_date = '12-'+'31-'+ $('#entry_year-tf').val();}
		if( e_type != 'T'){e_time = '23:59';}
		$.ajax({
			url: '/addEntry',
			type: 'POST',
			data: {entry_title:$('#entry_title-tf').val(),
					entry_date:e_date,
					entry_time:e_time,
					entry_text:$('#entry_text-tf').val(),
					entry_type:e_type,
					entry_pics:pics},
			success: function(data){
				var ec = new EntryController();
				if(e_type =='T' || e_type =='D'){
					alert(e_date);
					var curday = e_date.split('-');
					curday[2]++;
					ec.fetchData('/prevdayentry',curday.join('-'),function(udata){
 						ec.printData_day(udata);
					});
				}
			},
			error: function(jqXHR){
				alert(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}
});

function EntryController()
{

	this.fetchData= function(furl,date,callback){
		$.ajax({
				url: furl,
				type: 'POST',
				data: { user_id: $('#userId').val(),day: date},
				dataType: "json",
				//contentType: "application/json",
				success: function(data){
					callback(data);
				},
				error: function(jqXHR){
					alert('error');
					console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
				}
		});
	}
	this.printData_day= function(data){
		var items=[];
		var curday =data[0].entry_time.split(' ');
		items.push("<h2 id='currentday'>"+curday[0]+"</h2>")
		for (var i = 0; i < data.length; i++){
			var time = data[i].entry_time.split(' ');
			var btn_html = '<button class="btn btn-mini" onclick="deleteEntry('+data[i].entry_id+')"><i class="icon-remove"></i></button>';
			var title = (data[i].title==null) ?'':data[i].title;
			var timetitle = (data[i].entry_type=='D')?'<h3>'+title+'</h3>':'<h4>'+time[1]+'  :  '+title+'</h4>';
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
		//items.push('</div>');
		$('#entries').html(items.join(''));
		$('#entries').focus();
	}


	this.printData_month= function(data){
		var items=[];
		var curday =data[0].entry_time.split(' ');
		var curmonth = curday[0].split('.');
		items.push("<h2 hidden='true' id='currentmonth'>"+curday[0]+"</h2>");
		//alert(curmonth[0]);
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
		//items.push('</div>');
		$('#entries_month').html(items.join(''));
		$('#entries_month').focus();
	}
	this.printData_year= function(data){
		var items=[];
		var curday =data[0].entry_time.split(' ');
		var curmonth = curday[0].split('.');
		items.push("<h2 hidden='true' id='currentyear'>"+curday[0]+"</h2>");
		//alert(curmonth[0]);
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
		//items.push('</div>');
		$('#entries_year').html(items.join(''));
		$('#entries_year').focus();
	}


}