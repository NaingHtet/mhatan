//function deleteEntry(entry_id){
	//alert('Deleting');
	////$('.modal-confirm').modal('hide');
	//$.ajax({
		//url: '/delentry',
		//type: 'POST',
		//data: { id: entry_id },
		//success: function(data){
			//var ec = new EntryController();
			//ec.fetchData(function(udata){
 				//ec.printData(udata);
			//});
		//},
		//error: function(jqXHR){
			//alert(jqXHR.responseText+' :: '+jqXHR.statusText);
		//}
	//});
//}

//$('#btn-post').click(function(){
	//console.log("diaryController: button clicked");
	//if($('#diary_name-tf').val()!=''){
		//d_name = $('#diary_name-tf').val();
		//d_desc = $('#diary_desc-tf').val();
		//d_cat = $('#diary_category-tf').val();
		//$.ajax({
			//url: '/addDiary',
			//type: 'POST',
			//data: { diary_name:d_name,
					//diary_desc:d_desc,
					//diary_cat:d_cat},
					
			//success: function(data){
				//console.log("diaryController: added shiz");
				////var dc = new DiaryController();
				////dc.fetchData(function(udata){
					////dc.printData(udata);
					////$('#entry_text-tf').val('');
				//});
			//},
			//error: function(jqXHR){
				//alert(jqXHR.responseText+' :: '+jqXHR.statusText);
			//}
		//});
	//}
//});

//function DiaryController()
//{
	//this.printData= function(data){
		//var items=[];
		//var curday ='';
		//items.push('<div>');
		//for (var i = 0; i < data.length; i++){
			//var time = data[i].entry_time.split(' ');
			//if(time[0]!=curday){
				//items.push('</div><hr><div class="well span8">'+time[0]+'<hr>');
				//curday =time[0];
			//}
			////var btn_html = '<button class="btn btn-mini" onclick="deleteEntry('+data[i].entry_id+')"><i class="icon-remove"></i></button>';
			////var title = (data[i].title==null) ?'':'<h6>'+data[i].title +'</h6>';
			//items.push('<p>'+time[1]+btn_html+title+'<p>'+data[i].text_content.replace(/\n\r?/g, '<br />') + '</p><hr></p>');
		//}
		////items.push('</div>');
		//$('#entries').html(items.join(''));
	//}

	//this.fetchData= function(callback){
		//$.ajax({
				//url: '/entry',
				//type: 'POST',
				//data: { user_id: $('#userId').val()},
				//dataType: "json",
				////contentType: "application/json",
				//success: function(data){
					//callback(data);
				//},
				//error: function(jqXHR){
					//alert('error');
					//console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
				//}
		//});
	//}
}