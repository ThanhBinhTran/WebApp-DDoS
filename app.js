var express = require('express'),
bodyParser = require('body-parser'),
methodOverride = require('method-override'),
errorHandler = require('errorhandler'),
morgan = require('morgan'),
path = require('path');

var exec = require('child_process').exec,
child;

//file system
const fs = require('fs');

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
    var upper_address     = '7760'
    var nf0_rx_Gbps_add   = upper_address + '006c';
    var nf1_rx_Gbps_add   = upper_address + '0068';
    var nf2_rx_Gbps_add   = upper_address + '0064';
    var nf3_rx_Gbps_add   = upper_address + '0060';

    var nf0_tx_Gbps_add   = upper_address + '005c';
    var nf1_tx_Gbps_add   = upper_address + '0058';
    var nf2_tx_Gbps_add   = upper_address + '0054';
    var nf3_tx_Gbps_add   = upper_address + '0050';

    var nf0_drop_Gbps_add = upper_address + '004c';
    var nf1_drop_Gbps_add = upper_address + '0048';
    var nf2_drop_Gbps_add = upper_address + '0044';
    var nf3_drop_Gbps_add = upper_address + '0040';

    var nf0_rx_Pps_add    = upper_address + '003c';
    var nf1_rx_Pps_add    = upper_address + '0038';
    var nf2_rx_Pps_add    = upper_address + '0034';
    var nf3_rx_Pps_add    = upper_address + '0030';

    var nf0_tx_Pps_add    = upper_address + '002c';
    var nf1_tx_Pps_add    = upper_address + '0028';
    var nf2_tx_Pps_add    = upper_address + '0024';
    var nf3_tx_Pps_add    = upper_address + '0020';

    var nf0_drop_Pps_add  = upper_address + '001c';
    var nf1_drop_Pps_add  = upper_address + '0018';
    var nf2_drop_Pps_add  = upper_address + '0014';
    var nf3_drop_Pps_add  = upper_address + '0010';

    var nf0_tx_ID_Gbps = 1;
    var nf1_tx_ID_Gbps = 2;
    var nf2_tx_ID_Gbps = 3;
    var nf3_tx_ID_Gbps = 4;

    var nf0_rx_ID_Gbps = 5;
    var nf1_rx_ID_Gbps = 6;
    var nf2_rx_ID_Gbps = 7;
    var nf3_rx_ID_Gbps = 8;

    var nf0_drop_ID_Gbps = 9;
    var nf1_drop_ID_Gbps = 10;
    var nf2_drop_ID_Gbps = 11;
    var nf3_drop_ID_Gbps = 12;

    var nf0_tx_ID_Pps = 21;
    var nf1_tx_ID_Pps = 22;
    var nf2_tx_ID_Pps = 23;
    var nf3_tx_ID_Pps = 24;

    var nf0_rx_ID_Pps = 25;
    var nf1_rx_ID_Pps = 26;
    var nf2_rx_ID_Pps = 27;
    var nf3_rx_ID_Pps = 28;

    var nf0_drop_ID_Pps = 29;
    var nf1_drop_ID_Pps = 30;
    var nf2_drop_ID_Pps = 31;
    var nf3_drop_ID_Pps = 32;

    var incoming_nf_history = [];
    var outgoing_nf_history = [];

    //set interval of data query
    var interval_timer = 200000;

    //GET SERVER TIME
    setInterval(function() {
      var send_data = [];
      send_data.push(0);
      send_data.push(new Date().getTime());
      io.emit('realtime Chart', send_data);
    },interval_timer);

    /* get speed of gigabit per seconds */
    //TX
    setInterval( function(){GetSpeed_Gbps(nf0_tx_Gbps_add, nf0_tx_ID_Gbps );},interval_timer);
    setInterval( function(){GetSpeed_Gbps(nf1_tx_Gbps_add, nf1_tx_ID_Gbps );},interval_timer);
    setInterval( function(){GetSpeed_Gbps(nf2_tx_Gbps_add, nf2_tx_ID_Gbps );},interval_timer);
    setInterval( function(){GetSpeed_Gbps(nf3_tx_Gbps_add, nf3_tx_ID_Gbps );},interval_timer);

    //RX
    setInterval( function(){GetSpeed_Gbps(nf0_rx_Gbps_add, nf0_rx_ID_Gbps );},interval_timer);
    setInterval( function(){GetSpeed_Gbps(nf1_rx_Gbps_add, nf1_rx_ID_Gbps );},interval_timer);
    setInterval( function(){GetSpeed_Gbps(nf2_rx_Gbps_add, nf2_rx_ID_Gbps );},interval_timer);
    setInterval( function(){GetSpeed_Gbps(nf3_rx_Gbps_add, nf3_rx_ID_Gbps );},interval_timer);

    //DROP
    setInterval( function(){GetSpeed_Gbps(nf0_drop_Gbps_add, nf0_drop_ID_Gbps );},interval_timer);
    setInterval( function(){GetSpeed_Gbps(nf1_drop_Gbps_add, nf1_drop_ID_Gbps );},interval_timer);
    setInterval( function(){GetSpeed_Gbps(nf2_drop_Gbps_add, nf2_drop_ID_Gbps );},interval_timer);
    setInterval( function(){GetSpeed_Gbps(nf3_drop_Gbps_add, nf3_drop_ID_Gbps );},interval_timer);

    /* initialization data for history*/
    for(var i = 0; i < 4; i ++){
      outgoing_nf_history[i] = [i,i];
      incoming_nf_history[i] = [4-i, 4-i];
    }
    /*get speed of packet per seconds */
    //TX
    setInterval( function(){GetSpeed_Pps(nf0_tx_Pps_add, nf0_tx_ID_Pps, incoming_nf_history, outgoing_nf_history);},interval_timer);
    setInterval( function(){GetSpeed_Pps(nf1_tx_Pps_add, nf1_tx_ID_Pps, incoming_nf_history, outgoing_nf_history);},interval_timer);
    setInterval( function(){GetSpeed_Pps(nf2_tx_Pps_add, nf2_tx_ID_Pps, incoming_nf_history, outgoing_nf_history);},interval_timer);
    setInterval( function(){GetSpeed_Pps(nf3_tx_Pps_add, nf3_tx_ID_Pps, incoming_nf_history, outgoing_nf_history);},interval_timer);

    //RX
    setInterval( function(){GetSpeed_Pps(nf0_rx_Pps_add, nf0_rx_ID_Pps, incoming_nf_history, outgoing_nf_history );},interval_timer);
    setInterval( function(){GetSpeed_Pps(nf1_rx_Pps_add, nf1_rx_ID_Pps, incoming_nf_history, outgoing_nf_history );},interval_timer);
    setInterval( function(){GetSpeed_Pps(nf2_rx_Pps_add, nf2_rx_ID_Pps, incoming_nf_history, outgoing_nf_history );},interval_timer);
    setInterval( function(){GetSpeed_Pps(nf3_rx_Pps_add, nf3_rx_ID_Pps, incoming_nf_history, outgoing_nf_history );},interval_timer);

    //DROP
    setInterval( function(){GetSpeed_Pps(nf0_drop_Pps_add, nf0_drop_ID_Pps, incoming_nf_history, outgoing_nf_history );},interval_timer);
    setInterval( function(){GetSpeed_Pps(nf1_drop_Pps_add, nf1_drop_ID_Pps, incoming_nf_history, outgoing_nf_history );},interval_timer);
    setInterval( function(){GetSpeed_Pps(nf2_drop_Pps_add, nf2_drop_ID_Pps, incoming_nf_history, outgoing_nf_history );},interval_timer);
    setInterval( function(){GetSpeed_Pps(nf3_drop_Pps_add, nf3_drop_ID_Pps, incoming_nf_history, outgoing_nf_history );},interval_timer);

    /* BINH ADDED [END]*/
    number_realtimechart--;
  }

  // Update feature

  //query data then send bitfiles information to client
  socket.on('get bitfiles information',function(data) {
    var queryStr = 'SELECT * FROM bitfile ORDER BY version DESC';
    db.query(queryStr, function(err,rows){
      if(err) throw err;

      socket.emit('bitfile records',rows);
      //console.log(rows);
    });
  });

  socket.on('check bitfile running',function() {
    console.log("Checking bitfile");
    var version_reg = '0x78200004';
    var cmd = 'rdaxi ' + version_reg;
    child = exec(cmd, function (error, stdout, stderr) {
      var version_number;
      //console.log(stdout);
      stdout.trim();
      var sub_string = stdout.split('=');
      if(sub_string.length < 2){
        console.log("Failed!!");
        socket.emit('version running',"0"); //0 mean no version found
      } else {
        var sub_string1 = sub_string[1].split('\n');
        version_number  = sub_string1[0];
        console.log("Found version:" + version_number);
          socket.emit('version running', version_number);
          //socket.emit('version running', "0x10001");
      }

      if (error !== null) {
        console.log(error);
      }
    });
  });

  socket.on('update bitfile',function(version) {

    //var scriptPath  = './apps/manage_bitfile/download_bitfile.sh';
    var scriptPath  = './apps/manage_bitfile/download_bitfile_DDoS_v';
    var bitfilePath = './apps/manage_bitfile/bitfiles/';
    var filename = 'DDoS_' + version + '.bit';

    var fd = '#!/bin/bash\n';
        fd +='source /home/netfpga/Working/netfpga/NetFPGA-10G-live-release_5.0.7/bashrc_addon_NetFPGA_10G\n';
        fd += 'sh /home/netfpga/Working/netfpga/NetFPGA-10G-live-release_5.0.7/tools/scripts/impact_run.sh ' + bitfilePath + filename;
    
    scriptPath += version + '.sh';
    console.log('execute cmd:' + scriptPath );

    exec(scriptPath, function (error, stdout, stderr) {
      console.log(stdout);
      if (error !== null) {
        console.log(error);
        var query = 'INSERT INTO `notifications` (`datetime`, `name`, `desc`, `status`) VALUES ( \'' +
                    getDateNow() + ' ' + getTimeNow() + '\', "Update ' + filename +' failed", " '+ error + '", "new")';
        socket.emit('update bitfile done', "error");
        console.log('update bitfile error');
      } else {
        var query = 'INSERT INTO `notifications` (`datetime`, `name`, `desc`, `status`) VALUES ( \'' +
                    getDateNow() + ' ' + getTimeNow() + '\', "Updated ' + filename +' successfull", " Update bitfile successfull", "new")';
        socket.emit('update bitfile done', "success");
        console.log('update bitfile success');
      }
      db.query(query);
      io.emit('new_notifications added',''); //update dashboard

    });

    /*
    *
    * for future use
    *

    //write srcipt for download bitfile
    fs.writeFile(scriptPath, fd,  function(err) {
      if (err) {
        return console.error(err);
      }
      console.log("Data written successfully!");
    });

   //change mode file
    fs.chmodSync(scriptPath, '777');

    console.log('execute cmd:' + scriptPath );
    exec(scriptPath, function (error, stdout, stderr) {
      console.log(stdout);
      if (error !== null) {
        console.log(error);
        var query = 'INSERT INTO `notifications` (`datetime`, `name`, `desc`, `status`) VALUES ( \'' +
                    getDateNow() + ' ' + getTimeNow() + '\', "Update ' + filename +' failed", " '+ error + '", "new")';
        socket.emit('update bitfile done', "error");
      } else {
        var query = 'INSERT INTO `notifications` (`datetime`, `name`, `desc`, `status`) VALUES ( \'' +
                    getDateNow() + ' ' + getTimeNow() + '\', "Updated ' + filename +' successfull", " Update bitfile successfull", "new")';
        socket.emit('update bitfile done', "success");
      }
      db.query(query);
      io.emit('new_notifications added',''); //update dashboard
    });
    */
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
      //console.log(rows);
    });

    queryStr = 'SELECT * FROM notifications where status = "dismiss"';
    db.query(queryStr, function(err,rows){
      if(err) throw err;

      socket.emit('dismiss notification results',rows);
      //console.log(rows);
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
      //console.log(rows);
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
      //console.log(rows);
    });
  });

  /* get new notifications number*/
  socket.on('new_notifications', function(data){
    console.log("new_notifications");
    var queryStr = 'SELECT * FROM notifications where status = "new"';
    db.query(queryStr, function(err,rows){
      if(err) throw err;
      socket.emit('new_notifications results',rows);
      //console.log(rows);
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
function execute_cmd(cmd){
  exec(cmd, function (error, stdout, stderr)
  {
    console.log('Execute cmd:');
    console.log(stdout);
    if (error !== null) {
      console.log(error);
      return -1;
    }
    return stdout;
  });
}

// get speed of Gbps via axilite then display to real Chart
function GetSpeed_Gbps(nf_Gbps_add, nf_ID){
  child = exec('rdaxi ' + nf_Gbps_add,
  function (error, stdout, stderr) {
    var NF_byte = 0;
    // through-put *8*10/(1000*1000*1000) <=> *8 bit * 10 (convert to sec) / 1G
    var GbpS_ratio = 8/(1000*1000*100);
    var sub_string = stdout.split('=');
    if(sub_string.length < 2){
      //console.log("No data to send!!!")
      var send_data = [nf_ID,new Date().getTime(),0];
      //var send_data = [nf_ID,new Date().getTime(),new Date().getTime()%10];
      //io.emit('realtime Chart', send_data);
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
      //console.log("data sent GBPs" + NF_byte + "   " + sub_string[1]);
    }
    //console.log("NF1TX_byte GBpS:" + sub_string);
    if (error !== null) {
      console.log(error);
    }
  });
}

// get speed of Pps via axilite then display to real Chart
function GetSpeed_Pps(nf_Pps_add, nf_ID, incoming_data, drop_data){
  child = exec('rdaxi ' + nf_Pps_add,
  function (error, stdout, stderr) {
    var NF_byte = 0;
    var sub_string = stdout.split('=');
    var query;
    if(sub_string.length < 2){
      //console.log("No data to send!!!")
      var send_data = [nf_ID,new Date().getTime(),0];
      //var send_data = [nf_ID,new Date().getTime(),new Date().getTime()%10];
      //io.emit('realtime Chart', send_data);
    } else {
      var sub_string1 = sub_string[1].split('\n');
      var sub_string2 = sub_string1[0].split('x');
      var value = sub_string2[1].split('');

      var reverse_value = value.reverse();

      for (var k = 0; k < reverse_value.length; k++) {
        NF_byte += hex2dec(reverse_value[k])* Math.pow(16,k);
      }
      NF_byte = NF_byte*10;   //convert to second
      var send_data = [];
      send_data.push(nf_ID);
      send_data.push(new Date().getTime());
      send_data.push(NF_byte);
      io.emit('realtime Chart', send_data);
      //console.log("data sent PPS" + NF_byte + "   " + sub_string[1]);

      var nf_id ;
      if     ( nf_ID == 29 || nf_ID == 21) nf_id = 0;
      else if( nf_ID == 30 || nf_ID == 22) nf_id = 1;
      else if( nf_ID == 31 || nf_ID == 23) nf_id = 2;
      else if( nf_ID == 32 || nf_ID == 24) nf_id = 3;

      if(nf_ID == 21)      {incoming_data[0] = [NF_byte,getDateNow() + ' ' + getTimeNow()];}
      else if(nf_ID == 22) {incoming_data[1] = [NF_byte,getDateNow() + ' ' + getTimeNow()];}
      else if(nf_ID == 23) {incoming_data[2] = [NF_byte,getDateNow() + ' ' + getTimeNow()];}
      else if(nf_ID == 24) {incoming_data[3] = [NF_byte,getDateNow() + ' ' + getTimeNow()];}

      //drop data
      else if(nf_ID == 29) {drop_data[0] = [NF_byte,getDateNow() + ' ' + getTimeNow()];}
      else if(nf_ID == 30) {drop_data[1] = [NF_byte,getDateNow() + ' ' + getTimeNow()];}
      else if(nf_ID == 31) {drop_data[2] = [NF_byte,getDateNow() + ' ' + getTimeNow()];}
      else if(nf_ID == 32) {drop_data[3] = [NF_byte,getDateNow() + ' ' + getTimeNow()];}
      //UPDATE EVENTS IF ATTACKING detected; IDs FROM 29 TO 32 USE FOR DROP
      if((nf_ID >= 29 && nf_ID <= 31)  && (NF_byte > 0) ){

        query = 'INSERT INTO events (`datetime`,`name`,`desc`,`status`) VALUES ("' +
                                            getDateNow() + ' ' + getTimeNow() + '", "Acttack detected", "Acttack come to NF'+nf_id+' ", "new")';
        //console.log(query);
        db.query(query);
        io.emit('new_alerts added','');
      }

      //records to history
      if((nf_id == 0) && (incoming_data[0][1] == drop_data[0][1])){
        query = 'INSERT INTO `history` (`datetime`,`nf_interface`,`packet_per_second`,`packet_drop_per_second`) VALUES (\'' +
                                          getDateNow() + ' ' + getTimeNow() + '\', ' + nf_id +', '+incoming_data[0][0]+',' + drop_data[0][0]+')';
        //console.log(query);
        db.query(query);
      }
      else if((nf_id == 1) && (incoming_data[1][1] == drop_data[1][1])){
        query = 'INSERT INTO `history` (`datetime`,`nf_interface`,`packet_per_second`,`packet_drop_per_second`) VALUES (\'' +
                                          getDateNow() + ' ' + getTimeNow() + '\', ' + nf_id +', '+incoming_data[1][0]+',' + drop_data[1][0]+')';
        //console.log(query);
        db.query(query);
      }
      else if((nf_id == 2) && (incoming_data[2][1] == drop_data[2][1])){
        query = 'INSERT INTO `history` (`datetime`,`nf_interface`,`packet_per_second`,`packet_drop_per_second`) VALUES (\'' +
                                          getDateNow() + ' ' + getTimeNow() + '\', ' + nf_id +', '+incoming_data[2][0]+',' + drop_data[2][0]+')';
        //console.log(query);
        db.query(query);
      }
      else if((nf_id == 3) && (incoming_data[3][1] == drop_data[3][1])){
        query = 'INSERT INTO `history` (`datetime`,`nf_interface`,`packet_per_second`,`packet_drop_per_second`) VALUES (\'' +
                                          getDateNow() + ' ' + getTimeNow() + '\', ' + nf_id +', '+incoming_data[3][0]+',' + drop_data[3][0]+')';
        //console.log(query);
        db.query(query);
      }

    }
    //console.log("NF1TX_byte GBpS:" + sub_string);
    if (error !== null) {
      console.log(error);
    }
  });
}


http.listen(3003, function(){
  console.log('listening on *:3003');
});
