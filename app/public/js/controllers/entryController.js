function deleteEntry(entry_id){
	//$('.modal-confirm').modal('hide');
	$.ajax({
		url: '/delentry',
		type: 'POST',
		data: { id: entry_id },
		success: function(data){
			var ec = new EntryController();
			ec.fetchData(function(udata){
 				ec.printData(udata);
			});
		},
		error: function(jqXHR){
			console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
		}
	});
}
$('#btn-post').click(function(){
	if($('#entry_text-tf').val()!=''){
		$.ajax({
			url: '/addEntry',
			type: 'POST',
			data: {entry_title:$('#entry_title-tf').val(),
					entry_date:$('#entry_date-tf').val(),
					entry_time:$('#entry_time-tf').val(),
					entry_text:$('#entry_text-tf').val()},
			success: function(data){
				var ec = new EntryController();
				ec.fetchData(function(udata){
					ec.printData(udata);
					//$('#entry_text-tf').val('');
				});
			},
			error: function(jqXHR){
				alert('fail');
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}
});

function EntryController()
{
	this.printData= function(data){
		var items=[];
		var curday ='';
		items.push('<div>');
		for (var i = 0; i < data.length; i++){
			var time = data[i].entry_time.split(' ');
			if(time[0]!=curday){
				items.push('</div><hr><div class="well span8">'+time[0]+'<hr>');
				curday =time[0];
			}
			console.log('test');
			var btn_html = '<button class="btn btn-mini" onclick="deleteEntry('+data[i].entry_id+')"><i class="icon-remove"></i></button>';
			var title = (data[i].title==null) ?'':'<h6>'+data[i].title +'</h6>';
			items.push('<p>'+time[1]+btn_html+title+'<p>'+data[i].text_content.replace(/\n\r?/g, '<br />') + '</p><hr></p>');
		}
		//items.push('</div>');
		$('#entries').html(items.join(''));
	}

	this.fetchData= function(callback){
		$.ajax({
				url: '/entry',
				type: 'POST',
				data: { user_id: $('#userId').val()},
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
}