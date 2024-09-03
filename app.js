//Node.js app that uses the Express framework

//Set up a basic Express web server that listens on port 3000
//Logs a message to the browser console to indicate the server is running

//This script sets up a simple web server to handle
//HTTP requests on port 3000


//The Express variable imports the Express framework
//App variable creates an instance of an Express application
var express = require('express');
var app=express();

//What do these lines do
var session = require('express-session');
var conn = require('./dbConfig');
app.set('view engine','ejs');

//More lines added but what do they do
app.use(session({
    secret: 'yoursecret',
    resave: true,
    saveUninitialized: true
}));

app.use('/public', express.static('public')); //step 46 why in  between app.set and app.get

//What do these lines do
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//Members Only feature
app.get('/membersOnly', function (req, res, next) {
	if (req.session.loggedin) {
		res.render("membersOnly");
	}
	else {
		res.send("Please login to view this page!");
	}
});

//Logout feature
app.get('/logout',(req,res) => { //why don't need function
    req.session.destroy();
    res.redirect('/');
});

//Informational pages
app.get('/', function (_req, res){
    res.render("home");
    });

app.get('/auckland', function (_req, res){
    res.render("auckland");
    });

app.get('/beaches', function (_req, res){
    res.render("beaches");
    });          


app.get('/listMPs', function (_req, res){
    conn.query("SELECT * FROM mps", function (err, result) {
        if (err) throw err;
        console.log(result);
        res.render("listMPs", { title:'List of NZ MPs', MPsData: result});
    });
});

//Submit MPs feature
//Users can access this only if they are logged in
app.get('/addMPs', function (_req, res, next){
    if (_req.session.loggedin) { 
        res.render("addMPs");
    }
    else {
        res.send('Please login to view this page');
    }
});


 app.post('/addMPs',function(req, res, next){
    var id = req.body.id;
    var name = req.body.name;
    var party = req.body.party;
    var sql ='INSERT INTO mps (id, name, party) VALUES ("${id}", "${name}", "${party}")';
    conn.query(sql, function(err, result){
        if (err) throw err;
        console.log('record inserted');
        res.render("addMPs");
    });
 });

 //Login feature
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

app.get('/teapot',(_req,res)=>{
    res.status(418).send("The requested entity body is short and stout. Tip me over and pour me out.")
});

//Feedback feature
app.get('/feedback', function (_req, res){
    res.render("feedback");
    });

app.post('/feedback',function (req, res){
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var gender = req.body.gender;
    var email = req.body.email;
    var confirmEmail = req.body.confirmEmail;
    var feedback = req.body.feedback;
    var sql = 'Insert INTO feedback('
    if (firstname && lastname){
        conn.query('SELECT * FROM feedback WHERE firstname= ? AND lastname = ?', [firstname,lastname], function(error, results, fields){
                if (error) throw error;
                if (results.length > 0) {
                    req.session.loggedin = true;
                    req.session.firstname = firstname;
                    req.session.lastname = lastname;
                } else {
                    res.send('The form is missing some information!');
                }
                res.end();
            });
    } else {
        res.send('Please complete the required fields on the form!');
        res.end
    }
});


//App listens into port 3000
//Starts the server and makes it ready to handle HTTP requests
app.listen(3000);
console.log('Node app is running without issues on port 3000');