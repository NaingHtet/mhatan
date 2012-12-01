function deleteEntry(entry_id){
	//$('.modal-confirm').modal('hide');
	$.ajax({
		url: '/delentry',
		type: 'POST',
		data: { id: entry_id },
		success: function(data){
			var ec = new EntryController();
			ec.fetchData(function(udata){
				//alert(udata);
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

		for (var i = 0; i < data.length; i++){
			items.push('<p>'+data[i].entry_time+'<button class="btn btn-mini" onclick="deleteEntry('+data[i].entry_id+')"><i class="icon-remove"></i></button><p>'+data[i].text_content.replace(/\n\r?/g, '<br />') + '</p><hr></p>');
		}
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