/* DATABASE-MANAGER.JS
 * Connects to the database and handle queries
 */

var pg = require('pg');

//Our database address and specifications
var conString = "postgres://postgres:nmh12345@127.0.0.1/mhatandb";

//Connecting the database
var DBM = {}; 
DBM.db = new pg.Client(conString);
DBM.db.connect();
module.exports = DBM;

//Logs in the user manually
DBM.manualLogin = function(email, pass, callback)
{
	var query = DBM.db.query({
		text: "SELECT user_id,pen_name,password FROM users WHERE users.email = $1",
		values: [email] }
	,function(err,result){
		if(result.rowCount == 0){
			callback('user-not-found');
		}else{
			if (bcrypt.compareSync(pass,result.rows[0].password)){
				callback(null, {user_id:result.rows[0].user_id,email:email,user:result.rows[0].pen_name});
			}	else{
				callback('invalid-password');
			}
		}
	});
}

//Adds new entry
DBM.addEntry = function(user_id,data,callback)
{
	DBM.db.query("SELECT MAX(entry_id) FROM entries",function(err,result){
		var entryid= result.rows[0].max+1;
		DBM.db.query({
			text:"INSERT INTO entries VALUES($1, $2, $6, $3, $4, $5, 'now','now', $7)",
			values: [entryid,
					user_id,data.entry_text,
					data.entry_title,
					data.entry_date+' '+data.entry_time,
					data.entry_type,
					data.diary_id]
		},function(err,result){
			if(err){
				console.log(data.diary_id);
				console.log("We have encountered the following error in Database. 4")
				console.log(err);
			}else
				callback(result,entryid);
		});
	});
}

//Adds new diary
DBM.addDiary = function(user_id,data,callback)
{
	DBM.db.query({
		text:"INSERT INTO diary VALUES(null, $1, $2, $3, 'none', null, null, 'now','now',$4)",
		values: [user_id,
				data.diary_name,
				data.diary_desc,
				data.diary_url]
	},function(err,result){ 
		if(err){
			console.log("We have encountered the following error in Database. 5")
			console.log(err);
		}else
			callback(result);
	});
}

//Adds pictures
DBM.addPics = function(user_id,pics,entry_id,callback)
{
	function picQueries(i){
		DBM.db.query("SELECT MAX(media_id) FROM media_file",function(err,result){
		 	var file_id = result.rows[0].max+1;
		 	DBM.db.query({
				text:"INSERT INTO media_file VALUES($1, $2, null, $3, 'P','now')",
				values: [file_id,pics[i].pic_url,user_id]
			},function(err,result){
				if(err){
					console.log("We have encountered the following error in Database. 6")
					console.log(err);
				}
				if(!err){
					DBM.db.query({
						text:"INSERT INTO embeds VALUES($1,$2,null)",
						values: [entry_id,file_id]
					},function(err,result){
						if( i+1 == pics.length){
							callback(result);
						}else{
							picQueries(i+1);
						}
					});
				}
			});
		});
	}
	picQueries(0)
}

//Adds new user
DBM.signup = function(newData, callback)
{
	var query = DBM.db.query(
		{
		text: "SELECT COUNT(*) FROM users WHERE users.email = $1",
		values: [newData.email] }
	,function(err,result){
		if (result.rows[0].count != 0){
			callback('email-taken');
		}	else{
			DBM.saltAndHash(newData.pass, function(hash){
				DBM.db.query("SELECT MAX(user_id) FROM users",function(err,result){
					DBM.db.query({
						text:"INSERT INTO users VALUES($1, $2, $3, $4, null,null,'now', 'now')",
						values: [result.rows[0].max+1,newData.email,hash,newData.user]
						},function(err,result){ 
							if(err){
								console.log("We have encountered the following error in Database. 7")
								console.log(err);
							}else
								callback(err,result)}
					);
				});
			});
		}
	});
}

//TODO: Encrypts password
DBM.saltAndHash = function(pass, callback)
{
	bcrypt.genSalt(10, function(err, salt) {
		console.log(pass);
		console.log(salt);
		bcrypt.hash(pass, salt, function(err, hash) {
	 		callback(hash);
	 	});
	});
}

//Returns all the user records
DBM.getAllRecords = function(callback)
{
	var query = DBM.db.query( "SELECT email,pen_name,time_joined FROM users",
	function(err,result){
		callback(err,result.rows);
		});
};


//Returns the timed and day entries after the specified day
DBM.getNextDayEntries = function(day,user_id,diary_id,callback)
{
	var query = DBM.db.query( {
	text:"SELECT entrieslist.*,pics.pic_list FROM (Select entry_id,entry_type,text_content,title,entry_time AS sort_time,to_char(entry_time,'MM.DD.YYYY HH12:MIDBM') AS entry_time from entries where entries.user_id=$1 AND entries.diary_id=$3 AND (entry_type='T' OR entry_type='D') AND date_trunc('day',entry_time)= date_trunc('day', (SELECT MIN(entry_time) FROM entries WHERE date_trunc('day',entry_time)> $2 AND user_id=$1 AND (entry_type='T' OR entry_type='D'))) ORDER By entries.entry_time ASC) AS entrieslist LEFT OUTER JOIN (SELECT entry_id,array_agg(media_file_url) as pic_list from embeds,media_file where user_id=$1 AND embeds.media_id=media_file.media_id GROUP BY entry_id) AS pics ON entrieslist.entry_id = pics.entry_id ORDER BY entrieslist.sort_time;",
	values: [user_id,day,diary_id] },
	function(err,result){
		if(err){
			console.log("We have encountered the following error in Database. 12")
			console.log(err);
		}else
			callback(err,result.rows);
	});
};

//Returns the timed and day entries before the specified day
DBM.getPrevDayEntries = function(day,user_id,diary_id,callback)
{
	var query = DBM.db.query( {
	text:"SELECT entrieslist.*,pics.pic_list FROM (Select entry_id,entry_type,text_content,title,entry_time AS sort_time,to_char(entry_time,'MM.DD.YYYY HH12:MIDBM') AS entry_time from entries where entries.user_id=$1 AND entries.diary_id=$3 AND (entry_type='T' OR entry_type='D') AND date_trunc('day',entry_time)= date_trunc('day', (SELECT MAX(entry_time) FROM entries WHERE date_trunc('day',entry_time)< $2 AND user_id=$1 AND (entry_type='T' OR entry_type='D'))) ORDER By entries.entry_time ASC) AS entrieslist LEFT OUTER JOIN (SELECT entry_id,array_agg(media_file_url) as pic_list from embeds,media_file where user_id=$1 AND embeds.media_id=media_file.media_id GROUP BY entry_id) AS pics ON entrieslist.entry_id = pics.entry_id ORDER BY entrieslist.sort_time;",
	values: [user_id,day,diary_id] },
	function(err,result){
		if(err){
			console.log("We have encountered the following error in Database. 8")
			console.log(err);
		}else		
			callback(err,result.rows);
	});
};

//Returns the month and day entries before the specified day
DBM.getPrevMonthEntries = function(day,user_id,diary_id,callback)
{
	var query = DBM.db.query( {
	text:"SELECT entrieslist.*,pics.pic_list FROM (Select entry_id,entry_type,text_content,title,entry_time AS sort_time,to_char(entry_time,'MM.DD.YYYY HH12:MIDBM') AS entry_time from entries where entries.user_id=$1 AND entries.diary_id=$3 AND (entry_type='M' OR entry_type='D') AND date_trunc('month',entry_time)= date_trunc('month', (SELECT MAX(entry_time) FROM entries WHERE date_trunc('month',entry_time)< $2 AND user_id=$1 AND (entry_type='M' OR entry_type='D'))) ORDER By entries.entry_time ASC) AS entrieslist LEFT OUTER JOIN (SELECT entry_id,array_agg(media_file_url) as pic_list from embeds,media_file where user_id=$1 AND embeds.media_id=media_file.media_id GROUP BY entry_id) AS pics ON entrieslist.entry_id = pics.entry_id ORDER BY entrieslist.sort_time;",
	values: [user_id,day,diary_id] },
	function(err,result){
		if(err){
			console.log("We have encountered the following error in Database. 9")
			console.log(err);
		}else
			callback(err,result.rows);
	});
};

//Returns the month and day entries after the specified day
DBM.getNextMonthEntries = function(day,user_id,diary_id,callback)
{
	var query = DBM.db.query( {
	text:"SELECT entrieslist.*,pics.pic_list FROM (Select entry_id,entry_type,text_content,title,entry_time AS sort_time,to_char(entry_time,'MM.DD.YYYY HH12:MIDBM') AS entry_time from entries where entries.user_id=$1 AND entries.diary_id=$3 AND (entry_type='M' OR entry_type='D') AND date_trunc('month',entry_time)= date_trunc('month', (SELECT MIN(entry_time) FROM entries WHERE date_trunc('month',entry_time)> $2 AND user_id=$1 AND (entry_type='M' OR entry_type='D'))) ORDER By entries.entry_time ASC) AS entrieslist LEFT OUTER JOIN (SELECT entry_id,array_agg(media_file_url) as pic_list from embeds,media_file where user_id=$1 AND embeds.media_id=media_file.media_id GROUP BY entry_id) AS pics ON entrieslist.entry_id = pics.entry_id ORDER BY entrieslist.sort_time;",
	values: [user_id,day,diary_id] },
	function(err,result){
		if(err){
			console.log("We have encountered the following error in Database. 10")
			console.log(err);
		}else
			callback(err,result.rows);
	});
};

//Returns the month and year entries before the specified day
DBM.getPrevYearEntries = function(day,user_id,diary_id,callback)
{
	var query = DBM.db.query( {
	text:"SELECT entrieslist.*,pics.pic_list FROM (Select entry_id,entry_type,text_content,title,entry_time AS sort_time,to_char(entry_time,'MM.DD.YYYY HH12:MIDBM') AS entry_time from entries where entries.user_id=$1 AND entries.diary_id=$3 AND (entry_type='M' OR entry_type='Y') AND date_trunc('year',entry_time)= date_trunc('year', (SELECT MAX(entry_time) FROM entries WHERE date_trunc('year',entry_time)< $2 AND user_id=$1 AND (entry_type='M' OR entry_type='Y'))) ORDER By entries.entry_time ASC) AS entrieslist LEFT OUTER JOIN (SELECT entry_id,array_agg(media_file_url) as pic_list from embeds,media_file where user_id=$1 AND embeds.media_id=media_file.media_id GROUP BY entry_id) AS pics ON entrieslist.entry_id = pics.entry_id ORDER BY entrieslist.sort_time;",
	values: [user_id,day,diary_id] },
	function(err,result){
		if(err){
			console.log("We have encountered the following error in Database. 1")
			console.log(err);
		}else
			callback(err,result.rows);
	});
};

//Returns the month and year entries after the specified day
DBM.getNextYearEntries = function(day,user_id,diary_id,callback)
{
	var query = DBM.db.query( {
	text:"SELECT entrieslist.*,pics.pic_list FROM (Select entry_id,entry_type,text_content,title,entry_time AS sort_time,to_char(entry_time,'MM.DD.YYYY HH12:MIDBM') AS entry_time from entries where entries.user_id=$1 AND entries.diary_id=$3 AND (entry_type='M' OR entry_type='Y') AND date_trunc('year',entry_time)= date_trunc('year', (SELECT MIN(entry_time) FROM entries WHERE date_trunc('year',entry_time)> $2 AND user_id=$1 AND (entry_type='M' OR entry_type='Y'))) ORDER By entries.entry_time ASC) AS entrieslist LEFT OUTER JOIN (SELECT entry_id,array_agg(media_file_url) as pic_list from embeds,media_file where user_id=$1 AND embeds.media_id=media_file.media_id GROUP BY entry_id) AS pics ON entrieslist.entry_id = pics.entry_id ORDER BY entrieslist.sort_time;",
	values: [user_id,day,diary_id] },
	function(err,result){
		if(err){
			console.log("We have encountered the following error in Database. 11")
			console.log(err);
		}else
			callback(err,result.rows);
	});
};

//Returns all the entries
DBM.getAllEntries = function(callback)
{
	var query = DBM.db.query( "SELECT * FROM entries WHERE user_id=1",
	function(err,result){
		callback(err,result.rows);
		});
};

//Deletes the entry
DBM.deleteEntry = function(id,callback)
{
	var query = DBM.db.query( {
		text: "DELETE FROM entries WHERE entry_id=$1",
		values: [id]},
	function(err,result){
		if(err){
			console.log("We have encountered the following error in Database. 2")
			console.log(err);
		}else
			callback(err);
	});
};

//Returns all the diary
DBM.getDiaries = function(user_id,callback)
{
	var query = DBM.db.query( {
		text: "SELECT * FROM diary WHERE user_id=$1",
		values: [user_id] },
	function(err,result){
		callback(err,result.rows);
	});
};

DBM.getDiaryId = function(user_id,diary_url,callback)
{
	var query = DBM.db.query( {
		text: "SELECT diary_id FROM diary WHERE user_id=$1 AND url=$2",
		values: [user_id,diary_url] },
	function(err,result){
		if(err){
			console.log("We have encountered the following error in Database. 3")
			console.log(err);
		}else{
			if(result.rowCount == 0)
				callback('err',null);
			else
				callback(err,result.rows[0].diary_id);	
		}
	});
};
