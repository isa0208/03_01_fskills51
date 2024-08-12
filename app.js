//Node.js app that uses the Express framework

//Set up a basic Express web server that listens on port 3000
//Logs a message to the browser console to indicate the server is running

//This script sets up a simple web server to handle
//HTTP requests on port 3000


//Express variable imports the Express framework
//App variable creates an instance of an Express application
var express = require('express');
var app = express();

app.set('view engine','ejs');

app.use('/public', express.static('public')); //step 46 why in  between app.set and app.get

app.get('/', function (_req, res){
    res.render("home");
    });

app.get('/auckland', function (_req, res){
    res.render("auckland");
    });

app.get('/beaches', function (_req, res){
    res.render("beaches");
    });
          

//App listens into port 3000
//Starts the server and makes it ready to handle HTTP requests
app.listen(3000);
console.log('Node app is running without issues on port 3000');