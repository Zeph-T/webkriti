const mysql = require("mysql");

 

const mySqlConnection = mysql.createConnection({

    host: "sql12.freemysqlhosting.net", 

    user: "sql12329769",
    
    password: "scJeJ2ujvn",
    
    database: "sql12329769"

});

 

mySqlConnection.connect(err => {

if (err) console.log(err);

console.log("Database Connected!");

});

 

module.exports = mySqlConnection;