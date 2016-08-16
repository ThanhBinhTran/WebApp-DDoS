var mysql = require('mysql');

var pool  = mysql.createPool({
      host     : '127.0.0.1',
      user     : 'serveradmin',
      password : 'admindotserver',
      database : 'truyentranhdb',
      charset  : 'utf8_general_ci',
      connectionLimit : 20
});

exports.getConnection = function(cb) {
    pool.getConnection(function(err,connection) {
        cb(err,connection);
    });
};
