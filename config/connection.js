// Dependencies
var mysql = require('mysql');
var config = require('../config/general');

// Config files
var db = {
    "port": config.dbPort,
    "host": config.host,
    "user": config.user,
    "password": config.password,
    "database": config.database
};

// TUTORIAL: http://sudoall.com/node-js-handling-mysql-disconnects/
var connection;
function handleDisconnect() {
  connection = mysql.createConnection(db); // Recreate the connection, since the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
       throw err;                                 // server variable configures this)
    };
  });
};

handleDisconnect();

module.exports = connection;