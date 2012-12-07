/**
 * Mhatan main file
 * Author : Naing Minn Htet
 */

/**
 * Code Credit : This is based on the login framework on node-login.braitsch.io .
 */
var exp = require('express');
var app = exp.createServer();

app.root = __dirname;
global.host = 'localhost';

require('./app/config')(app, exp);
require('./app/server/router')(app);

app.listen(3000, function(){
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});