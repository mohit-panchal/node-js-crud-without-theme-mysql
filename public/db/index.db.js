var mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test_ecom'
});
connection.connect(function (err) {
  if (err) throw err;
  console.log("Mysql Database Connected...");
});
module.exports=connection;