//View Engine Set Up
var express = require('express');
var app=express();
var session = require('express-session');
var conn = require('./dbConfig');
app.set('view engine','ejs');
app.use(session({
    secret: 'yoursecret',
    resave: true,
    saveUninitialized: true
}));
app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

//Informational Pages
app.get('/', function (_req, res){
    res.render("home");
    });

app.get('/classes', function (_req, res){
    res.render("classes");
    });

app.get('/visa', function (_req, res){
    res.render("visa");
    });

//Class Pages
app.get('/classgroup', function (_req, res){
    res.render("classgroup");
    });

app.get('/classprivate', function (_req, res){
    res.render("classprivate");
    });

app.get('/classpass', function (_req, res){
    res.render("classpass");
    });

//Get List of Class Prices
app.get('/prices', function(_req, res) {
	var sql = 'SELECT * FROM prices';
	conn.query(sql, function (err, result) {
		if (err) {
			console.error(err);
			return res.status(500).send("Internal Server Error");
		}
		console.log(result)
		res.render('prices',
		{title: 'prices', priceData: result || []});		
	});	
});

app.get('/get-feedback', function(req, res) {
    var sql = 'SELECT * FROM feedback';
    conn.query(sql, function(err, results) {
        if (err) throw err;
        res.json(results); // Send the results as JSON
    });
});

//Login feature
app.get('/login', function (_req, res){
    res.render("login");
    });
 
app.post('/auth', function(req, res) {
	let username = req.body.username;
	let password = req.body.password;
	if (username && password) {
		conn.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (error) throw error;
			console.log(results.length);
			if (results.length > 0) {
				req.session.loggedin = true;			
				req.session.username = username;
				req.session.userrole = results[0].role;
				console.log(results.length);
				console.log("User name :",results[0].username);
				console.log("User role :",results[0].role)			
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
//Guests and admin can only access if they are logged in
app.get('/membersOnly', function (req, res) {
	if (req.session.loggedin){
		if(req.session.userrole === "guest"){
			res.render('membersOnly');
		}
		else if(req.session.userrole === "admin"){
			res.render('adminOnly');
		}
		else{
			res.send('Page not found for this user ');

		}
	}
}
);

//Logout feature
app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});
      

app.get('/teapot',(_req,res)=>{
    res.status(418).send("The requested entity body is short and stout. Tip me over and pour me out.")
});


//Register User
app.get('/register', function (req, res){
	res.render("register");
});
app.post('/register', function(req, res) {
	let username = req.body.username;
	let password = req.body.password;
	if (username && password) {
		var sql = `INSERT INTO users (username, password, role) VALUES ("${username}", "${password}", "guest")`;
		conn.query(sql, function(err, result) {
			if (err) throw err;
			console.log('record inserted');
			res.render('login');
		})
	}
	else {
		console.log("Error");
	}
  });


//Free trial form - to rename from feedback in DB
app.get('/feedback2', function (_req, res){
    res.render("feedback2");
    });
app.get('/get-feedback', function(req, res) {
    var sql = 'SELECT * FROM feedback';
    conn.query(sql, function(err, results) {
        if (err) throw err;
        res.json(results); // Send the results as JSON
    });
});

//Submit free trial
app.post('/submit-trial', function(req, res) {
	let firstName = req.body['first-name'];
	let lastName = req.body['last-name'];
	let gender = req.body.gender;
	let email = req.body.email;
	let confirmEmail = req.body['confirm-email'];
	let feedback = req.body.feedback;
	

	// Check if all fields are filled and emails match
	if (firstName && lastName && gender && email && confirmEmail && feedback && email === confirmEmail) {
		var sql = `INSERT INTO feedback (first_name, last_name, gender, email, feedback) VALUES ("${firstName}", "${lastName}", "${gender}", "${email}", "${feedback}")`;
		conn.query(sql, function(err, result) {
			if (err) throw err;
			console.log('Sign Up Success');
			res.render('thankyou'); 
		});
	} else {
		console.log("Error: All fields are required, and emails must match.");
		res.render('/feedback2', { error: 'All fields are required, and emails must match.' }); // Render the form again with an error message
	}
});


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

//App listens into port 3000
//Starts the server and makes it ready to handle HTTP requests
app.listen(3000);
console.log('Node app is running without issues on port 3000');