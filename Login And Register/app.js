// 
// To demo Login and Register
// Author: Ganeshan
// Date created: 12 Agust 2024
// Version: 1.0

var express = require('express');
var session = require('express-session');
var conn = require('./dbConfig');
var app=express();

//ejs template
app.set('view engine','ejs');

app.use(session({
	secret: 'yoursecret',
	resave: true,
	saveUninitialized: true
}));

app.use('/public', express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res){
	res.render("home");
});
	
app.get('/page2', function (req, res){
	res.render("page2");
});

app.get('/loginRegister', function (req, res){
	res.render("loginRegister");
});

app.get('/login', function(req, res) {
	res.render('login.ejs');
});

app.post('/auth', function(req, res) {
	let username = req.body.username;
	let password = req.body.password;
	if (username && password) {
		conn.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/membersOnly');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

app.get('/register', function (req, res){
	res.render("register");
});

//REGISTER USER
app.post('/register', function(req, res) {
	let username = req.body.username;
	let password = req.body.password;
	if (username && password) {
		var sql = `INSERT INTO users (username, password) VALUES ("${username}", "${password}")`;
		conn.query(sql, function(err, result) {
			if (err) throw err;
			console.log('record inserted');
			res.render('loginRegister');
		})
	}
	else {
		console.log("Error");
	}
  });
  
// Users can access this if they are logged in
app.get('/membersOnly', function (req, res, next) {
	if (req.session.loggedin) {
		res.render('membersOnly');
	} 
	else {
		res.send('Please login to view this page!');
	}
});

app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});
 
app.listen(3000);
console.log('Node app is running on port 3000');
