var mysql = require('mysql');
var conn = mysql.createConnection({
	host: 'localhost', 
	user: 'root',      
	password: '',    
	database: 'mynewdb'
}); 

conn.connect(function(err) {
	if (err) throw err;
	console.log('Database connected');
});

module.exports = conn;