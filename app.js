//Node.js app that uses the Express framework

//Set up a basic Express web server that listens on port 3000
//Logs a message to the browser console to indicate the server is running

//This script sets up a simple web server to handle
//HTTP requests on port 3000


//Express variable imports the Express framework
//App variable creates an instance of an Express application
var express = require('express');
var app=express();

//What do these lines do
var session = require('express-session');
var conn = require('./dbConfig');
app.set('view engine','ejs');

//More lines added for session
app.use(session({
    secret: 'yoursecret',
    resave: true,
    saveUninitialized: true
}));

app.use('/public', express.static('public')); //step 46 why in  between app.set and app.get

//what's this
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//Users can access if they are logged in
app.get('/membersOnly', function (req, res, next) {
	if (req.session.loggedin) {
		res.render("membersOnly");
	}
	else {
		res.send("Please login to view this page!");
	}
});

app.get('/logout',(req,res) => { //why don't need function
    req.session.destroy();
    res.redirect('/');
});

app.get('/', function (_req, res){
    res.render("home");
    });

app.get('/auckland', function (_req, res){
    res.render("auckland");
    });

app.get('/beaches', function (_req, res){
    res.render("beaches");
    });          

app.get('/login', function (_req, res){
    res.render("login");
    });

app.post('/auth',function(req, res){
    let username = req.body.username;
    let password = req.body.password;
    if (username && password){
        conn.query('SELECT * FROM users WHERE username = ? AND password = ?', [username,password], function(error, results, fields){
                if (error) throw error;
                if (results.length > 0) {
                    req.session.loggedin = true;
                    req.session.username = username;
                    res.redirect('/membersOnly');
                
                } else {
                    res.send('Incorrect username and/or password!');
                }
                res.end();
            });
    } else {
        res.send('Please enter username and password!');
        res.end
    }
});

//App listens into port 3000
//Starts the server and makes it ready to handle HTTP requests
app.listen(3000);
console.log('Node app is running without issues on port 3000');