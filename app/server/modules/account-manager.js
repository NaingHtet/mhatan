/* ACCOUNT-MANAGER.JS
 * Connects to the database and handle queries
 */

var pg = require('pg');

//Our database address and specifications
var conString = "postgres://journaldb:d5B9LCsg@127.0.0.1:5433/journaldb";

//Connecting the database
var AM = {}; 
AM.db = new pg.Client(conString);
AM.db.connect();
module.exports = AM;

//Logs in the user manually
AM.manualLogin = function(email, pass, callback)
{
	var query = AM.db.query({
		text: "SELECT user_id,pen_name,password FROM users WHERE users.email = $1",
		values: [email] }
	,function(err,result){
		if(result.rowCount == 0){
			callback('user-not-found');
		}else{
			if (result.rows[0].password == pass){
				callback(null, {user_id:result.rows[0].user_id,email:email,user:result.rows[0].pen_name});
			}	else{
				callback('invalid-password');
			}
		}
	});
}

//Adds new entry
AM.addEntry = function(user_id,data,callback)
{
	AM.db.query("SELECT MAX(entry_id) FROM entries",function(err,result){
		var entryid= result.rows[0].max+1;
		AM.db.query({
			text:"INSERT INTO entries VALUES($1, $2, $6, $3, $4, $5, 'now','now')",
			values: [entryid,
					user_id,data.entry_text,
					data.entry_title,
					data.entry_date+' '+data.entry_time,
					data.entry_type]
		},function(err,result){
			console.log("We have encountered the following error in Database.")
			console.log(err);
			callback(result,entryid);
		});
	});
}

//Adds new diary
AM.addDiary = function(user_id,data,callback)
{
	AM.db.query({
		text:"INSERT INTO diary VALUES(null, $1, $2, $3, $4, null, null, 'now','now')",
		values: [user_id,
				data.diary_name,
				data.diary_desc,
				data.diary_category]
	},function(err,result){ 
		console.log("We have encountered the following error in Database.")
		console.log(err);
		callback(result);
	});
}

//Adds pictures
AM.addPics = function(user_id,pics,entry_id,callback)
{
	function picQueries(i){
		AM.db.query("SELECT MAX(media_id) FROM media_file",function(err,result){
		 	var file_id = result.rows[0].max+1;
		 	AM.db.query({
				text:"INSERT INTO media_file VALUES($1, $2, null, $3, 'P','now')",
				values: [file_id,pics[i].pic_url,user_id]
			},function(err,result){
				console.log("We have encountered the following error in Database.")
				console.log(err);
				if(!err){
					AM.db.query({
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
AM.signup = function(newData, callback)
{
	var query = AM.db.query(
		{
		text: "SELECT COUNT(*) FROM users WHERE users.email = $1",
		values: [newData.email] }
	,function(err,result){
		if (result.rows[0].count != 0){
			callback('email-taken');
		}	else{
			AM.saltAndHash(newData.pass, function(){
				AM.db.query("SELECT MAX(user_id) FROM users",function(err,result){
					AM.db.query({
						text:"INSERT INTO users VALUES($1, $2, $3, $4, null,null,'now', 'now')",
						values: [result.rows[0].max+1,newData.email,newData.pass,newData.user]
						},function(err,result){ 
							console.log("We have encountered the following error in Database.")
							console.log(err);
							callback(err,result)}
					);
				});
			});
		}
	});
}

//TODO: Encrypts password
AM.saltAndHash = function(pass, callback)
{
	// bcrypt.genSalt(10, function(err, salt) {
	// 	bcrypt.hash(pass, salt, function(err, hash) {
	// 		callback(hash);
	// 	});
	// });
	callback();
}

//Returns all the user records
AM.getAllRecords = function(callback)
{
	var query = AM.db.query( "SELECT email,pen_name,time_joined FROM users",
	function(err,result){
		callback(err,result.rows);
		});
};

//Returns the user's entries
AM.getEntries = function(user_id,callback)
{
	var query = AM.db.query( {
		text : "SELECT entry_id,entry_type,text_content,title,to_char(entry_time,'MM.DD.YYYY HH12:MIAM') AS entry_time FROM entries WHERE user_id=$1 ORDER BY entries.entry_time DESC",
		values: [user_id] },
	function(err,result){
		callback(err,result.rows);
		});
};

//Returns the timed and day entries after the specified day
AM.getNextDayEntries = function(day,user_id,callback)
{
	var query = AM.db.query( {
	text:"SELECT entrieslist.*,pics.pic_list FROM (Select entry_id,entry_type,text_content,title,entry_time AS sort_time,to_char(entry_time,'MM.DD.YYYY HH12:MIAM') AS entry_time from entries where entries.user_id=$1 AND (entry_type='T' OR entry_type='D') AND date_trunc('day',entry_time)= date_trunc('day', (SELECT MIN(entry_time) FROM entries WHERE date_trunc('day',entry_time)> $2 AND user_id=$1 AND (entry_type='T' OR entry_type='D'))) ORDER By entries.entry_time ASC) AS entrieslist LEFT OUTER JOIN (SELECT entry_id,array_agg(media_file_url) as pic_list from embeds,media_file where user_id=$1 AND embeds.media_id=media_file.media_id GROUP BY entry_id) AS pics ON entrieslist.entry_id = pics.entry_id ORDER BY entrieslist.sort_time;",
	values: [user_id,day] },
	function(err,result){
		console.log("We have encountered the following error in Database.")
		console.log(err);
		callback(err,result.rows);
	});
};

//Returns the timed and day entries before the specified day
AM.getPrevDayEntries = function(day,user_id,callback)
{
	var query = AM.db.query( {
	text:"SELECT entrieslist.*,pics.pic_list FROM (Select entry_id,entry_type,text_content,title,entry_time AS sort_time,to_char(entry_time,'MM.DD.YYYY HH12:MIAM') AS entry_time from entries where entries.user_id=$1 AND (entry_type='T' OR entry_type='D') AND date_trunc('day',entry_time)= date_trunc('day', (SELECT MAX(entry_time) FROM entries WHERE date_trunc('day',entry_time)< $2 AND user_id=$1 AND (entry_type='T' OR entry_type='D'))) ORDER By entries.entry_time ASC) AS entrieslist LEFT OUTER JOIN (SELECT entry_id,array_agg(media_file_url) as pic_list from embeds,media_file where user_id=$1 AND embeds.media_id=media_file.media_id GROUP BY entry_id) AS pics ON entrieslist.entry_id = pics.entry_id ORDER BY entrieslist.sort_time;",
	values: [user_id,day] },
	function(err,result){
		console.log("We have encountered the following error in Database.")
		console.log(err);
		callback(err,result.rows);
	});
};

//Returns the month and day entries before the specified day
AM.getPrevMonthEntries = function(day,user_id,callback)
{
	var query = AM.db.query( {
	text:"SELECT entrieslist.*,pics.pic_list FROM (Select entry_id,entry_type,text_content,title,entry_time AS sort_time,to_char(entry_time,'MM.DD.YYYY HH12:MIAM') AS entry_time from entries where entries.user_id=$1 AND (entry_type='M' OR entry_type='D') AND date_trunc('month',entry_time)= date_trunc('month', (SELECT MAX(entry_time) FROM entries WHERE date_trunc('month',entry_time)< $2 AND user_id=$1 AND (entry_type='M' OR entry_type='D'))) ORDER By entries.entry_time ASC) AS entrieslist LEFT OUTER JOIN (SELECT entry_id,array_agg(media_file_url) as pic_list from embeds,media_file where user_id=$1 AND embeds.media_id=media_file.media_id GROUP BY entry_id) AS pics ON entrieslist.entry_id = pics.entry_id ORDER BY entrieslist.sort_time;",
	values: [user_id,day] },
	function(err,result){
		console.log("We have encountered the following error in Database.")
		console.log(err);
		callback(err,result.rows);
	});
};

//Returns the month and day entries after the specified day
AM.getNextMonthEntries = function(day,user_id,callback)
{
	var query = AM.db.query( {
	text:"SELECT entrieslist.*,pics.pic_list FROM (Select entry_id,entry_type,text_content,title,entry_time AS sort_time,to_char(entry_time,'MM.DD.YYYY HH12:MIAM') AS entry_time from entries where entries.user_id=$1 AND (entry_type='M' OR entry_type='D') AND date_trunc('month',entry_time)= date_trunc('month', (SELECT MIN(entry_time) FROM entries WHERE date_trunc('month',entry_time)> $2 AND user_id=$1 AND (entry_type='M' OR entry_type='D'))) ORDER By entries.entry_time ASC) AS entrieslist LEFT OUTER JOIN (SELECT entry_id,array_agg(media_file_url) as pic_list from embeds,media_file where user_id=$1 AND embeds.media_id=media_file.media_id GROUP BY entry_id) AS pics ON entrieslist.entry_id = pics.entry_id ORDER BY entrieslist.sort_time;",
	values: [user_id,day] },
	function(err,result){
		console.log("We have encountered the following error in Database.")
		console.log(err);
		callback(err,result.rows);
	});
};

//Returns the month and year entries before the specified day
AM.getPrevYearEntries = function(day,user_id,callback)
{
	var query = AM.db.query( {
	text:"SELECT entrieslist.*,pics.pic_list FROM (Select entry_id,entry_type,text_content,title,entry_time AS sort_time,to_char(entry_time,'MM.DD.YYYY HH12:MIAM') AS entry_time from entries where entries.user_id=$1 AND (entry_type='M' OR entry_type='Y') AND date_trunc('year',entry_time)= date_trunc('year', (SELECT MAX(entry_time) FROM entries WHERE date_trunc('year',entry_time)< $2 AND user_id=$1 AND (entry_type='M' OR entry_type='Y'))) ORDER By entries.entry_time ASC) AS entrieslist LEFT OUTER JOIN (SELECT entry_id,array_agg(media_file_url) as pic_list from embeds,media_file where user_id=$1 AND embeds.media_id=media_file.media_id GROUP BY entry_id) AS pics ON entrieslist.entry_id = pics.entry_id ORDER BY entrieslist.sort_time;",
	values: [user_id,day] },
	function(err,result){
		console.log("We have encountered the following error in Database.")
		console.log(err);
		callback(err,result.rows);
	});
};

//Returns the month and year entries after the specified day
AM.getNextYearEntries = function(day,user_id,callback)
{
	var query = AM.db.query( {
	text:"SELECT entrieslist.*,pics.pic_list FROM (Select entry_id,entry_type,text_content,title,entry_time AS sort_time,to_char(entry_time,'MM.DD.YYYY HH12:MIAM') AS entry_time from entries where entries.user_id=$1 AND (entry_type='M' OR entry_type='Y') AND date_trunc('year',entry_time)= date_trunc('year', (SELECT MIN(entry_time) FROM entries WHERE date_trunc('year',entry_time)> $2 AND user_id=$1 AND (entry_type='M' OR entry_type='Y'))) ORDER By entries.entry_time ASC) AS entrieslist LEFT OUTER JOIN (SELECT entry_id,array_agg(media_file_url) as pic_list from embeds,media_file where user_id=$1 AND embeds.media_id=media_file.media_id GROUP BY entry_id) AS pics ON entrieslist.entry_id = pics.entry_id ORDER BY entrieslist.sort_time;",
	values: [user_id,day] },
	function(err,result){
		console.log("We have encountered the following error in Database.")
		console.log(err);
		callback(err,result.rows);
	});
};

//Returns all the entries
AM.getAllEntries = function(callback)
{
	var query = AM.db.query( "SELECT * FROM entries WHERE user_id=1",
	function(err,result){
		callback(err,result.rows);
		});
};

//Deletes the entry
AM.deleteEntry = function(id,callback)
{
	var query = AM.db.query( {
		text: "DELETE FROM entries WHERE entry_id=$1",
		values: [id]},
	function(err,result){
		console.log("We have encountered the following error in Database.")
		console.log(err);
		callback(err);
	});
};

//Returns all the diary
AM.getDiaries = function(user_id,callback)
{
	var query = AM.db.query( {
		text: "SELECT * FROM diary WHERE user_id=$1",
		values: [user_id] },
	function(err,result){
		callback(err,result.rows);
	});
};

