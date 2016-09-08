var express = require('express'),
bodyParser = require('body-parser'),
methodOverride = require('method-override'),
errorHandler = require('errorhandler'),
morgan = require('morgan'),
path = require('path');

var exec = require('child_process').exec,
child;

var app = module.exports = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(bodyParser());
app.use(methodOverride());
//app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
//*******________**********
var router = express.Router();
router.param('name', function(req, res, next, name) {
  // do validation on name here
  // blah blah validation
  // log something so we know its working
  console.log('doing name validations on ' + name);

  // once validation is done save the new item in the req
  req.name = name;
  // go to the next thing
  next();
});

router.use(function(req, res, next) {

  // log each request to the console
  console.log(req.method, req.url);

  // continue doing what we were doing and go to the route
  next();
});

router.get('/partials/:name', function(req, res) {
  var name = req.params.name;
  res.render('partials/'+ name)
});
router.get('#', function(req, res) {
  res.render('partials/test');
});
router.get('/', function(req, res) {
  res.render('index');
});

router.get('*', function(req, res) {
  res.render('index');
});


app.use('/', router);


/**
* Start Server
*/

var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql')


var db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  pass: 'root',
  database: 'DDoS_db'
});

db.connect(function(err){
  if(err){
    console.log( err);
    return;
  }
  console.log('MySQL: Connection established');
});
var notes = [];
var sumary_detail = [];
var isInitNotes = false;
var isSeeMore = false;
var socketCount = 1 ;// The var is config the number internal function for 1 client. Two client, two function, ...
var scan_by_admin = 1; // The var is use to unit_test by deverloper.
var number_realtimechart = 1 ; // The var is config the number interval function for server. It's mean, When the number client is more than 2, the function is one, only one.

var id_schedule; // The var is use to content the value of schedule id. When the schedule is running, It is keeping the value, Then the schedule is finish, it is give the value to make a query to SQL
var isSchedule_running = 0;
var d = new Date();
var today = d.getFullYear()+ "-" + (d.getMonth()+1) + "-" + d.getDate(); // use to query shedule : yyyy-mm-dd

var today_scan = d.getDate()+ "/"+ (d.getMonth()+1)+"/" +d.getFullYear(); // use to query scan_summary: dd/mm/yyyy

io.on('connection', function(socket){
  console.log('a user connected');
  socketCount = 1;

  if (number_realtimechart == 1) {

    /* BINH ADDED [START] */
    var nf0_rx_Gbps_reg_add = '77600010';
    var nf1_rx_Gbps_reg_add = '77600014';
    var nf2_rx_Gbps_reg_add = '77600018';
    var nf3_rx_Gbps_reg_add = '7760001a';

    var nf0_tx_Gbps_reg_add = '77600020';
    var nf1_tx_Gbps_reg_add = '77600024';
    var nf2_tx_Gbps_reg_add = '77600028';
    var nf3_tx_Gbps_reg_add = '7760002a';

    var nf0_drop_Gbps_reg_add = '77600020';
    var nf1_drop_Gbps_reg_add = '77600024';
    var nf2_drop_Gbps_reg_add = '77600028';
    var nf3_drop_Gbps_reg_add = '7760002a';

    var nf0_rx_Pps_reg_add = '77600010';
    var nf1_rx_Pps_reg_add = '77600014';
    var nf2_rx_Pps_reg_add = '77600018';
    var nf3_rx_Pps_reg_add = '7760001a';

    var nf0_tx_Pps_reg_add = '77600020';
    var nf1_tx_Pps_reg_add = '77600024';
    var nf2_tx_Pps_reg_add = '77600028';
    var nf3_tx_Pps_reg_add = '7760002a';

    var nf0_drop_Pps_reg_add = '77600020';
    var nf1_drop_Pps_reg_add = '77600024';
    var nf2_drop_Pps_reg_add = '77600028';
    var nf3_drop_Pps_reg_add = '7760002a';

    var nf0_tx_ID = 1;
    var nf1_tx_ID = 2;
    var nf2_tx_ID = 3;
    var nf3_tx_ID = 4;

    var nf0_rx_ID = 5;
    var nf1_rx_ID = 6;
    var nf2_rx_ID = 7;
    var nf3_rx_ID = 8;

    var nf0_drop_ID = 9;
    var nf1_drop_ID = 10;
    var nf2_drop_ID = 11;
    var nf3_drop_ID = 12;

    //set interval of data query
    var interval_timer = 10000;

    //GET SERVER TIME
    setInterval(function() {
      var send_data = [];
      send_data.push(0);
      send_data.push(new Date().getTime());
      io.emit('realtime Chart', send_data);
    },interval_timer);

    /* get speed of gigabit per seconds */
    //TX
    setInterval( function(){GetSpeed_Gbps(nf0_tx_Gbps_reg_add, nf0_tx_ID );},interval_timer);
    setInterval( function(){GetSpeed_Gbps(nf1_tx_Gbps_reg_add, nf1_tx_ID );},interval_timer);
    setInterval( function(){GetSpeed_Gbps(nf2_tx_Gbps_reg_add, nf2_tx_ID );},interval_timer);
    setInterval( function(){GetSpeed_Gbps(nf3_tx_Gbps_reg_add, nf3_tx_ID );},interval_timer);

    //RX
    setInterval( function(){GetSpeed_Gbps(nf0_rx_Gbps_reg_add, nf0_rx_ID );},interval_timer);
    setInterval( function(){GetSpeed_Gbps(nf1_rx_Gbps_reg_add, nf1_rx_ID );},interval_timer);
    setInterval( function(){GetSpeed_Gbps(nf2_rx_Gbps_reg_add, nf2_rx_ID );},interval_timer);
    setInterval( function(){GetSpeed_Gbps(nf3_rx_Gbps_reg_add, nf3_rx_ID );},interval_timer);

    //DROP
    setInterval( function(){GetSpeed_Gbps(nf0_drop_Gbps_reg_add, nf0_drop_ID );},interval_timer);
    setInterval( function(){GetSpeed_Gbps(nf1_drop_Gbps_reg_add, nf1_drop_ID );},interval_timer);
    setInterval( function(){GetSpeed_Gbps(nf2_drop_Gbps_reg_add, nf2_drop_ID );},interval_timer);
    setInterval( function(){GetSpeed_Gbps(nf3_drop_Gbps_reg_add, nf3_drop_ID );},interval_timer);

    /*get speed of packet per seconds */
    //TX
    setInterval( function(){GetSpeed_Pps(nf0_tx_Pps_reg_add, nf0_tx_ID );},interval_timer);
    setInterval( function(){GetSpeed_Pps(nf1_tx_Pps_reg_add, nf1_tx_ID );},interval_timer);
    setInterval( function(){GetSpeed_Pps(nf2_tx_Pps_reg_add, nf2_tx_ID );},interval_timer);
    setInterval( function(){GetSpeed_Pps(nf3_tx_Pps_reg_add, nf3_tx_ID );},interval_timer);

    //RX
    setInterval( function(){GetSpeed_Pps(nf0_rx_Pps_reg_add, nf0_rx_ID );},interval_timer);
    setInterval( function(){GetSpeed_Pps(nf1_rx_Pps_reg_add, nf1_rx_ID );},interval_timer);
    setInterval( function(){GetSpeed_Pps(nf2_rx_Pps_reg_add, nf2_rx_ID );},interval_timer);
    setInterval( function(){GetSpeed_Pps(nf3_rx_Pps_reg_add, nf3_rx_ID );},interval_timer);

    //DROP
    setInterval( function(){GetSpeed_Pps(nf0_drop_Pps_reg_add, nf0_drop_ID );},interval_timer);
    setInterval( function(){GetSpeed_Pps(nf1_drop_Pps_reg_add, nf1_drop_ID );},interval_timer);
    setInterval( function(){GetSpeed_Pps(nf2_drop_Pps_reg_add, nf2_drop_ID );},interval_timer);
    setInterval( function(){GetSpeed_Pps(nf3_drop_Pps_reg_add, nf3_drop_ID );},interval_timer);

    /* BINH ADDED [END]*/
    number_realtimechart--;
  }

  // Update feature

  //query data then send bitfiles information to client
  socket.on('get bitfiles information',function(data) {
    var queryStr = 'SELECT * FROM bitfile ORDER BY version DESC';

    console.log("get bitfiles information <->");
    db.query(queryStr, function(err,rows){
      if(err) throw err;

      socket.emit('bitfile records',rows);
      console.log(rows);
    });
  });

  socket.on('check bitfile running',function() {
    console.log("Check bitfile running");
    child = exec('rdaxi 0x78200000', function (error, stdout, stderr) {
      var data;
      console.log(stdout);
      stdout.trim();
      var sub_string = stdout.split('=');
      if(sub_string.length < 2){
        console.log("Failed!!");
        socket.emit('version running',"1.3");
      } else {
        var sub_string1 = sub_string[1].split('\n');
        if(sub_string1[0] == '0x11061830'){ //Vu_PCIs_with_virus
          data = 'ver1';
          socket.emit('version running', "1.1");
        }
        else if(sub_string1[0] == '0x11191730'){ // Vu_PCIs_without_virus
          data = 'ver2';
          socket.emit('version running', "1.2");
        }
        else if(sub_string1[0] == 'waiting info from Designer') //
          socket.emit('version running',"1.3");
        else {
          socket.emit('version running',"1.3");
          console.log(sub_string1[0]);
        }
      }

      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });

  });

  socket.on('update bitfile',function(data) {
    console.log(data);
    if(data == 'ver1') {
      console.log("Ver1 is updating...")
      bitfile = exec('./apps/manage_bitfile/program_with_bitfile.sh',
      function (error, stdout, stderr) {
        console.log(stdout);
        if (error !== null) {
          console.log('exec error: ' + error);
          socket.emit('update bitfile client', "error");
        } else {
          var query = 'INSERT INTO notification (name,link,time,date) VALUES ("New Update","/update","'+getTimeNow() +'","'+getDateNow()+'")';
          db.query(query);
          socket.emit('update bitfile client', "ver1_updated");
        }

      });


    } else if( data == 'ver2') {
      console.log("Ver2 is updating...")
      bitfile = exec('./apps/manage_bitfile/program_without_bitfile.sh',
      function (error, stdout, stderr) {
        console.log(stdout);
        if (error !== null) {
          console.log('exec error: ' + error);
          socket.emit('update bitfile client', "error");
        } else {
          var query = 'INSERT INTO notification (name,link,time,date) VALUES ("New Update","/update","'+getTimeNow() +'","'+getDateNow()+'")';
          db.query(query);
          socket.emit('update bitfile client', "ver2_updated");
        }
      });

    } else if( data == 'ver3') {
      console.log("Ver3 is updating...")
      bitfile = exec('./apps/manage_bitfile/program_speed_measure.sh',
      function (error, stdout, stderr) {
        console.log(stdout);
        if (error !== null) {
          console.log('exec error: ' + error);
          socket.emit('update bitfile client', "error");
        } else {
          var query = 'INSERT INTO notification (name,link,time,date) VALUES ("New Update","/update","'+getTimeNow() +'","'+getDateNow()+'")';
          db.query(query);
          socket.emit('update bitfile client', "ver3_updated");
        }
      });
    }
  });

  //Events Feature
  socket.on('event', function(data){

    var queryStr = 'SELECT * FROM events where status = "new"';

    console.log("event start ");
    db.query(queryStr, function(err,rows){
      if(err) throw err;

      socket.emit('new event results',rows);
      //console.log(rows);
    });

    queryStr = 'SELECT * FROM events where status = "dismiss"';
    db.query(queryStr, function(err,rows){
      if(err) throw err;

      socket.emit('dismiss event results',rows);
      //console.log(rows);
    });
  });

  socket.on('dismiss all event', function(data){
    //query all new alerts
    var queryStr = 'SELECT * FROM events where status = "new"';
    console.log("dismiss all event");
    db.query(queryStr, function(err,rows){
      if(err) throw err;
      //console.log(rows);
      //update status to dismiss
      for (var i = 0; i < rows.length; i++) {
        queryStr = 'UPDATE events SET status = "dismiss" WHERE id=' + rows[i].id;
        db.query(queryStr);
      };
    });
  });
  //Events Feature END

  //Notifications Feature
  socket.on('notification', function(data){
    var queryStr = 'SELECT * FROM notifications where status = "new"';
    console.log("notification start ");
    db.query(queryStr, function(err,rows){
      if(err) throw err;
      socket.emit('new notification results',rows);
      console.log(rows);
    });

    queryStr = 'SELECT * FROM notifications where status = "dismiss"';
    db.query(queryStr, function(err,rows){
      if(err) throw err;

      socket.emit('dismiss notification results',rows);
      console.log(rows);
    });
  });

  socket.on('dismiss all notification', function(data){
    //query all new alerts
    var queryStr = 'SELECT * FROM notifications where status = "new"';
    console.log("dismiss all notifications");
    db.query(queryStr, function(err,rows){
      if(err) throw err;
      //console.log(rows);
      //update status to dismiss
      for (var i = 0; i < rows.length; i++) {
        queryStr = 'UPDATE notifications SET status = "dismiss" WHERE id=' + rows[i].id;
        db.query(queryStr);
      };
    });
  });
  // notifications Feature END

  //history Feature
  socket.on('history', function(data){
    console.log("history_query: " + data);
    var date = data.split('to');           //the first date is start date, the second date is end date
    var queryStr = 'SELECT * FROM history WHERE datetime >= \'' + date[0] + '\' && datetime <= \'' + date[1] + '\'';

   db.query( queryStr,function(err,rows){
      if(err) throw err;

      socket.emit('history results',rows);
      console.log(rows);
    });
  });

  /*dashboard Feature  */
  /* get new alerts number*/
  socket.on('new_alerts', function(data){
    console.log("new_alerts");
    var queryStr = 'SELECT * FROM events where status = "new"';

    db.query(queryStr, function(err,rows){
      if(err) throw err;
      socket.emit('new_alerts results',rows);
      console.log(rows);
    });
  });

  /* get new notifications number*/
  socket.on('new_notifications', function(data){
    console.log("new_notifications");
    var queryStr = 'SELECT * FROM notifications where status = "new"';
    db.query(queryStr, function(err,rows){
      if(err) throw err;
      socket.emit('new_notifications results',rows);
      console.log(rows);
    });
  });

//end of functions
});

function hex2dec( value ) {
  switch (value) {
    case 'a':
    return 10;
    case 'b':
    return 11;
    case 'c':
    return 12;
    case 'd':
    return 13;
    case 'e':
    return 14;
    case 'f':
    return 15;
    default:
    return value;
  }
  return 0;
}


function getTimeNow() {
  var date = new Date();
  var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

  return hours + ":" + minutes + ":" + seconds;
}

// This format is used to upload to database. So It is important.
function getDateNow() {
  var d = new Date();
  var today = d.getFullYear() + "/"+ d.getMonth() + "/"+ d.getDate() ;
  return today;
}

// get speed of Gbps via axilite then display to real Chart
function GetSpeed_Gbps(nf_Gbps_reg_add, nf_ID){
  child = exec('rdaxi ' + nf_Gbps_reg_add,
  function (error, stdout, stderr) {
    var NF_byte = 0;
    // through-put *8*10/(1000*1000*1000) <=> 16 000 000 clock *8bit *160Mhz /1G
    var GbpS_ratio = 8*10/(1000*1000*1000);
    var sub_string = stdout.split('=');
    if(sub_string.length < 2){
      //console.log("No data to send!!!")
      //var send_data = [nf_ID,new Date().getTime(),0];
      var send_data = [nf_ID,new Date().getTime(),new Date().getTime()%10];
      io.emit('realtime Chart', send_data);
    } else {
      var sub_string1 = sub_string[1].split('\n');
      var sub_string2 = sub_string1[0].split('x');
      var value = sub_string2[1].split('');

      var reverse_value = value.reverse();

      for (var k = 0; k < reverse_value.length; k++) {
        NF_byte += hex2dec(reverse_value[k])* Math.pow(16,k);
      }

      NF_byte = NF_byte*GbpS_ratio;
      var send_data = [];
      send_data.push(nf_ID);
      send_data.push(new Date().getTime());
      send_data.push(NF_byte);
      io.emit('realtime Chart', send_data);
    }
    //console.log("NF1TX_byte GBpS:" + sub_string);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
}

// get speed of Pps via axilite then display to real Chart
function GetSpeed_Pps(nf_Gbps_reg_add, nf_ID){
  child = exec('rdaxi ' + nf_Gbps_reg_add,
  function (error, stdout, stderr) {
    var NF_byte ;
    var sub_string = stdout.split('=');
    if(sub_string.length < 2){
      //console.log("No data to send!!!")
      //var send_data = [nf_ID,new Date().getTime(),0];
      // updated database for alerts
/*
      var nf_id = (nf_ID + 1)% 4;
      if(((nf_ID >= 9)  &&  (nf_ID <= 12))  && (NF_byte > 0)){
            query = 'INSERT INTO events (`datetime`,`name`,`desc`,`status`) VALUES ("' +
                                            getDateNow() + ' ' + getTimeNow() + '", "Acttack detected", "Acttack come to NF'+nf_id+' ", "new")';
            console.log(query);
            db.query(query);
            io.emit('new_alerts added','');

      }
*/
      var send_data = [nf_ID, new Date().getTime(), new Date().getTime()%10];
      io.emit('realtime Chart', send_data);
    } else {
      var sub_string1 = sub_string[1].split('\n');
      var sub_string2 = sub_string1[0].split('x');
      var value = sub_string2[1].split('');

      var reverse_value = value.reverse();

      for (var k = 0; k < reverse_value.length; k++) {
        NF_byte += hex2dec(reverse_value[k])* Math.pow(16,k);
      }
      var send_data = [];
      var query;
      send_data.push(nf_ID);
      send_data.push(new Date().getTime());
      send_data.push(NF_byte);
      io.emit('realtime Chart', send_data);

      // updated database for alerts
      var nf_id = (nf_ID + 1)% 4;
      if(((nf_ID == nf0_drop_ID ) || (nf_ID == nf1_drop_ID ) || (nf_ID == nf2_drop_ID )|| (nf_ID == nf3_drop_ID ))
          && (NF_byte > 0)){
            query = 'INSERT INTO events (`datetime`,`name`,`desc`,`status`) VALUES ("' +
                                            getDateNow() + ' ' + getTimeNow() + '", "Acttack detected", "Acttack come to NF'+nf_id+' ", "new")';
            db.query(query);
            socket.emit('new_alerts added','');

      }

    }
    //console.log("NF1TX_byte GBpS:" + sub_string);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
}

http.listen(3003, function(){
  console.log('listening on *:3003');
});
