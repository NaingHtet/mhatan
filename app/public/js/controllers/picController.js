/* PICCONTROLLER.JS
 * Controller for adding and deleting pictures
 */


var pics =[];

function deletePic(pic_id){
	pics=jQuery.grep(pics,function(value){
		return value.pic_id != pic_id;
	});
	printPic();
}

function printPic(){
	var items =[];
	for(var i =0; i< pics.length ;i++){
		var pichtml = '<img src="'+ pics[i].pic_url+'">';
		var delbtn = '<button onclick="deletePic('+pics[i].pic_id+')">x</button>';
		items.push(pichtml+delbtn);
	}
	$('#url_list').html(items.join(''));
	$('#btn-pic').text('('+pics.length+') pictures');
}
function PicController()
{
	this.addPic = function(url){
		if(url!=null){
			if (pics.length==0){
				picid = 0;
			}else{
				picid = pics[pics.length-1].pic_id+1;
			}
			var pichtml = '<img src="'+ url+'">';
			var delbtn = '<button onclick="deletePic('+picid+')">x</button>';
			pics.push({pic_id:picid ,pic_url:url});
		}
	}
}