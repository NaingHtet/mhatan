/* ROUTER.JS
 * Routes the GET and POST commands
 */

var AM = require('./modules/account-manager');

module.exports = function(app) {
	//GET for home
	app.get('/home', function(req, res) {
	    if (req.session.user == null){
		// if user is not logged-in redirect back to login page //
	        res.redirect('/');
	    }   else{
	    // if user is logged-in, show the entries
			res.render('entry', {
				locals: {
					title : 'Welcome! '+req.session.user.user,
					udata : req.session.user
				}
			});
		}
	});

	//POST for addEntry
	app.post('/addEntry', function(req, res){
	    if (req.session.user == null){
		// if user is not logged-in redirect back to login page //
	        res.redirect('/');
	    }   else{
			if (req.body.entry_text != undefined) {
				//Add an new entry
				AM.addEntry(req.session.user.user_id,req.body, function(o,entry_id){
					if (o){
						if(req.body.entry_pics != undefined){
							//Add pictures if exists
							AM.addPics(req.session.user.user_id,req.body.entry_pics,entry_id,function(o){
								if(o){
									res.send('ok',200);
								}
							});
						}
						res.send('ok', 200);	
					}	else{
						res.send('error-creating-post', 400);
					}
				});
			}
		}
	});

	//GET for main login page //
	app.get('/', function(req, res){
	// check if the user's credentials are saved in a cookie //
		if ( req.cookies.email == undefined || req.cookies.pass == undefined){
			res.render('login', { locals: { title: 'Hello' }});
		}	else{
	// attempt automatic login //
			AM.manualLogin(req.cookies.email, req.cookies.pass, function(e,o){
				if (o != null){
				    req.session.user = o;
					res.redirect('/home');
				}	else{
					res.render('login', { locals: { title: 'Hello' }});
				}
			});
		}
	});
	
	//POST for main login page
	app.post('/', function(req, res){
	//login manually for the user
		AM.manualLogin(req.param('email'), req.param('pass'), function(e,o){
			if (!o){
				res.send(e, 400);
			}	else{
			    req.session.user = o;
				if (req.param('remember-me') == 'true'){
					res.cookie('email', o.email, { maxAge: 900000 });
					res.cookie('pass', req.param('pass'), { maxAge: 900000 });
				}
				res.send(o, 200);
			}
		});
	});
	
	
// creating new accounts //
	//GET for signup page
	app.get('/signup', function(req, res) {
		res.render('signup', {  locals: { title: 'Signup' }});
	});
	
	//POST for signup page
	app.post('/signup', function(req, res){
		AM.signup({
			email 	: req.param('email'),
			user 	: req.param('user'),
			pass	: req.param('pass'),
		}, function(e, o){
			if (e){
				res.send(e, 400);
			}	else{
				res.send('ok', 200);
			}
		});
	});
	
	//GET for print . Show all the accounts existing
	app.get('/print', function(req, res) {
		AM.getAllRecords( function(e, accounts){
			res.render('print', { locals: { title : 'Account List', accts : accounts } });
		})
	});

// Fetching and Deleting entries //
	//fetch entry for the day
	app.post('/entry',function(req,res) {
		AM.getEntries(req.body.user_id,function(e,edata){
			if(!e){
				res.contentType('json');
				res.send(JSON.stringify(edata));
			}
			else{
				console.log(e);
			}
		});
	});

	//fetch timed and day entries before the specified day
	app.post('/prevdayentry',function(req,res) {
		AM.getPrevDayEntries(req.body.day,req.body.user_id,function(e,edata){
			if(!e){
				res.contentType('json');
				res.send(JSON.stringify(edata));
			}
			else{
				console.log(e);
			}
		});
	});

	//fetch timed and day entries after the specified day
	app.post('/nextdayentry',function(req,res) {
		AM.getNextDayEntries(req.body.day,req.body.user_id,function(e,edata){
			if(!e){
				res.contentType('json');
				res.send(JSON.stringify(edata));
			}
			else{
				console.log(e);
			}
		});
	});

	//fetch month and day entries before the specified day
	app.post('/prevmonthentry',function(req,res) {
		AM.getPrevMonthEntries(req.body.day,req.body.user_id,function(e,edata){
			if(!e){
				res.contentType('json');
				res.send(JSON.stringify(edata));
			}
			else{
				console.log(e);
			}
		});
	});

	//fetch month and day entries after the specified day
	app.post('/nextmonthentry',function(req,res) {
		AM.getNextMonthEntries(req.body.day,req.body.user_id,function(e,edata){
			if(!e){
				res.contentType('json');
				res.send(JSON.stringify(edata));
			}
			else{
				console.log(e);
			}
		});
	});

	//fetch month and year entries before the specified day
	app.post('/prevyearentry',function(req,res) {
		AM.getPrevYearEntries(req.body.day,req.body.user_id,function(e,edata){
			if(!e){
				res.contentType('json');
				res.send(JSON.stringify(edata));
			}
			else{
				console.log(e);
			}
		});
	});

	//fetch month and year entries after the specified day
	app.post('/nextyearentry',function(req,res) {
		AM.getNextYearEntries(req.body.day,req.body.user_id,function(e,edata){
			if(!e){
				res.contentType('json');
				res.send(JSON.stringify(edata));
			}
			else{
				console.log(e);
			}
		});
	});

	//Delete entry
	app.post('/delentry', function(req, res){
		AM.deleteEntry(req.body.id, function(e){
			if (!e){
				res.send('ok', 200);
			}	else{
				res.send('entry not found', 400);
			}
	    });
	});

//Diary Management //
	//GET for diary
	app.get('/diary', function(req, res) {
		if (req.session.user == null){
			// if user is not logged-in redirect back to login page //
			res.redirect('/');
		} else {
			AM.getDiaries( req.session.user.user_id, function(e, data) {
				res.render('diary', { locals: { title : 'Diary List', diaries : data } });
			})
		}
	});

	//POST for diary
	app.post('/diary', function(req, res){
	    if (req.session.user == null){
		// if user is not logged-in redirect back to login page //
	        res.redirect('/');
	    }   else{
			if (req.body.diary_name != undefined) {
				//Add a new diary
				AM.addDiary(req.session.user.user_id,req.body, function(o){
					if (o){
						res.redirect('/diary');
					}	else{
						res.send('error-creating-diary', 400);
					}
				});
			}
		}
	});

//Misc.
	//Logout the user
	app.get('/logout', function(req, res){
		res.clearCookie('email',{path:'/'});
		res.clearCookie('pass',{path:'/'});
		req.session.destroy(function(e){ res.redirect('/'); });
	});
	
	//The about page
	app.get('/about', function(req, res){
		res.render('about', { title: 'About Mhatan'});
	});
	
	//the 404 page
	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

};