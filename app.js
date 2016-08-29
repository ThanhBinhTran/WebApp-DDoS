var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    morgan = require('morgan'),
    //routes = require('./routes/index'),
    // api = require('./routes/api'),
    //http = require('http'),
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
/*
   require('./routes/manga/manga').add_routes(app);

   app.get('/', routes.index);
//app.get('/partials/:name', routes.partials);

app.get('*', routes.test);
app.get('/api/name', api.name);
//app.get('/tmip/:name', routes.tmip);
*/
var router = express.Router();
// home page route (http://localhost:8080)
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

// about page route (http://localhost:8080/about)
router.get('*', function(req, res) {
    res.render('index');
});


// apply the routes to our application
app.use('/', router);


/**
 * Start Server
 */

var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql')
// Let's make node/socketio listen on port 3000
var db = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    pass: '',
    database: 'DDoS_db'
});
db.connect(function(err){
  if(err){
    console.log('ERROR: connecting to MySQL database: ' + err);
    return;
  }
  console.log('MySQL: Connection established');
});
var notes = []
var sumary_detail = []
var isInitNotes = false
var isSeeMore = false
var socketCount = 1 // The var is config the number internal function for 1 client. Two client, two function, ...
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
    /*  socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        });
        */
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });
    socket.on('Search',function(msg){
        sumary_detail = []
        db.query('SELECT * FROM `scan_sumary_detail` WHERE (time LIKE "%'+msg+'%" OR file LIKE "%'+msg+'%" OR status LIKE "%'+msg+'%" OR virus_name LIKE "%'+msg+'%")')
        .on('result', function(data){
            sumary_detail.push(data)
        })
    .on('end', function(){
        socket.emit('view sumary detail', sumary_detail)
    })
    notes = [];
    db.query('SELECT * FROM `scan_sumary` WHERE (time LIKE "%'+msg+'%" OR known_viruses LIKE "%'+msg+'%" OR engine_version LIKE "%'+msg+'%" OR systen_time LIKE "%'+msg+'%")')
        .on('result', function(data){
            // Push results onto the notes array
            //console.log(notes);
            notes.push(data)

        })
    .on('end', function(){
        // Only emit notes after query has been completed
        socket.emit('initial notes', notes)
    })
    });
    if (! isSeeMore){
        sumary_detail = [];
        db.query('SELECT * FROM `scan_sumary_detail`')
            .on('result', function(data){
                sumary_detail.push(data)
            })
        .on('end', function(){
            socket.emit('view sumary detail', sumary_detail)
        })
    }

    if (! isInitNotes) {
        // Initial app start, run db query

        notes = [];
        db.query('SELECT * FROM `scan_sumary`')
            .on('result', function(data){
                // Push results onto the notes array
                //console.log(notes);
                notes.push(data)

            })
        .on('end', function(){
            // Only emit notes after query has been completed
            socket.emit('initial notes', notes)
        })

        //isInitNotes = true
    } else {
        // Initial notes already exist, send out
        socket.emit('initial notes', notes)
    }

    if (number_realtimechart == 1) {

 //       /* BINH ADDED [START] */
 //       var nf0_rx_reg = '77600054'
 //       var nf1_rx_reg = '77600058'
 //       var nf2_rx_reg = '7760005c'
 //       var nf3_rx_reg = '77600060'
//
 //       var nf0_tx_reg = '77600064'
 //       var nf1_tx_reg = '77600068'
 //       var nf2_tx_reg = '7760006c'
  //      var nf3_tx_reg = '77600070'
/* BINH ADDED [START] */
        var nf0_rx_reg = '77600010'
        var nf1_rx_reg = '77600014'
        var nf2_rx_reg = '77600018'
        var nf3_rx_reg = '7760001a'

        var nf0_tx_reg = '77600020'
        var nf1_tx_reg = '77600024'
        var nf2_tx_reg = '77600028'
        var nf3_tx_reg = '7760002a'

        //set interval of data query
        var interval_timer = 1000

        // through-put *8*10/(1000*1000*1000) <=> 16 000 000 clock *8bit *160Mhz /1G
        var GbpS_ratio = 8*10/(1000*1000*1000)
        //GET SERVER TIME
        setInterval(function() {
                var send_data = [];
                send_data.push(0);
                send_data.push(new Date().getTime());
                io.emit('realtime Chart', send_data);
        },interval_timer);

        //nf0 tx
        setInterval(function() {
            child = exec('rdaxi ' + nf0_tx_reg,
                function (error, stdout, stderr) {
                    //	socket.on('real time Chart', function() {
                    //		io.emit();
                    //	}
                    var NF0_TX_byte = 0;
                    var sub_string = stdout.split('=');
                    if(sub_string.length < 2){
                        //console.log("No data to send!!!")
                            var send_data = [1,new Date().getTime(),new Date().getTime()%10];
                        io.emit('realtime Chart', send_data);
                    } else {
                        var sub_string1 = sub_string[1].split('\n');
                        var sub_string2 = sub_string1[0].split('x');
                        var value = sub_string2[1].split('');

                        var reverse_value = value.reverse();

                        for (var k = 0; k < reverse_value.length; k++) {
                            NF0_TX_byte += hex2dec(reverse_value[k])* Math.pow(16,k);
                        }

                        NF0_TX_byte = NF0_TX_byte*GbpS_ratio;
                        var send_data = [];
                        send_data.push(1);
                        send_data.push(new Date().getTime());
                        send_data.push(NF0_TX_byte);
                        io.emit('realtime Chart', send_data);
                    }

                    //console.log("NF0TX_byte GBpS:" + sub_string);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                });
        },interval_timer);

        //nf1 tx
        setInterval(function() {
            child = exec('rdaxi ' + nf1_tx_reg,
                function (error, stdout, stderr) {
                    //	socket.on('real time Chart', function() {
                    //		io.emit();
                    //	}
                    var NF1_TX_byte = 0;
                    var sub_string = stdout.split('=');
                    if(sub_string.length < 2){
                        //console.log("No data to send!!!")
                            var send_data = [2,new Date().getTime(),0];
                        io.emit('realtime Chart', send_data);
                    } else {
                        var sub_string1 = sub_string[1].split('\n');
                        var sub_string2 = sub_string1[0].split('x');
                        var value = sub_string2[1].split('');

                        var reverse_value = value.reverse();

                        for (var k = 0; k < reverse_value.length; k++) {
                            NF1_TX_byte += hex2dec(reverse_value[k])* Math.pow(16,k);
                        }

                        NF1_TX_byte = NF1_TX_byte*GbpS_ratio;
                        var send_data = [];
                        send_data.push(2);
                        send_data.push(new Date().getTime());
                        send_data.push(NF1_TX_byte);
                        io.emit('realtime Chart', send_data);
                    }
                    //console.log("NF1TX_byte GBpS:" + sub_string);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                });
        },interval_timer);

        //nf2 tx
        setInterval(function() {
            child = exec('rdaxi ' + nf2_tx_reg,
                function (error, stdout, stderr) {
                    //	socket.on('real time Chart', function() {
                    //		io.emit();
                    //	}
                    var NF2_TX_byte = 0;
                    var sub_string = stdout.split('=');
                    if(sub_string.length < 2){
                        //console.log("No data to send!!!")
                            var send_data = [3,new Date().getTime(),0];
                        io.emit('realtime Chart', send_data);
                    } else {
                        var sub_string1 = sub_string[1].split('\n');
                        var sub_string2 = sub_string1[0].split('x');
                        var value = sub_string2[1].split('');

                        var reverse_value = value.reverse();

                        for (var k = 0; k < reverse_value.length; k++) {
                            NF2_TX_byte += hex2dec(reverse_value[k])* Math.pow(16,k);
                        }

                        NF2_TX_byte = NF2_TX_byte*GbpS_ratio;
                        var send_data = [];
                        send_data.push(3);
                        send_data.push(new Date().getTime());
                        send_data.push(NF2_TX_byte);
                        io.emit('realtime Chart', send_data);
                    }
                    //console.log("NF2TX_byte GBpS:" + sub_string);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                });
        },interval_timer);
        //nf3 tx
        setInterval(function() {
            child = exec('rdaxi ' + nf3_tx_reg,
                function (error, stdout, stderr) {
                    //	socket.on('real time Chart', function() {
                    //		io.emit();
                    //	}
                    var NF3_TX_byte = 0;
                    var sub_string = stdout.split('=');
                    if(sub_string.length < 2){
                        //console.log("No data to send!!!")
                            var send_data = [4,new Date().getTime(),0];
                        io.emit('realtime Chart', send_data);
                    } else {
                        var sub_string1 = sub_string[1].split('\n');
                        var sub_string2 = sub_string1[0].split('x');
                        var value = sub_string2[1].split('');

                        var reverse_value = value.reverse();

                        for (var k = 0; k < reverse_value.length; k++) {
                            NF3_TX_byte += hex2dec(reverse_value[k])* Math.pow(16,k);
                        }

                        NF3_TX_byte = NF3_TX_byte*GbpS_ratio;
                        var send_data = [];
                        send_data.push(4);
                        send_data.push(new Date().getTime());
                        send_data.push(NF3_TX_byte);
                        io.emit('realtime Chart', send_data);
                    }
                    //console.log("NF3TX_byte GBpS:" + sub_string);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                });
        },interval_timer);

        //nf0 rx
        setInterval(function() {
            child = exec('rdaxi ' + nf0_rx_reg,
                function (error, stdout, stderr) {
                    //	socket.on('real time Chart', function() {
                    //		io.emit();
                    //	}
                    var NF0_RX_byte = 0;
                    var sub_string = stdout.split('=');
                    if(sub_string.length < 2){
                        //console.log("No data to send!!!")
                            var send_data = [5,new Date().getTime(),0];
                        io.emit('realtime Chart', send_data);
                    } else {
                        var sub_string1 = sub_string[1].split('\n');
                        var sub_string2 = sub_string1[0].split('x');
                        var value = sub_string2[1].split('');

                        var reverse_value = value.reverse();

                        for (var k = 0; k < reverse_value.length; k++) {
                            NF0_RX_byte += hex2dec(reverse_value[k])* Math.pow(16,k);
                        }
                        // through-put *8*16/(1000*1000*1000)
                        NF0_RX_byte = NF0_RX_byte*GbpS_ratio;
                        var send_data = [];
                        send_data.push(5);
                        send_data.push(new Date().getTime());
                        send_data.push(NF0_RX_byte);
                        io.emit('realtime Chart', send_data);
                    }
                    //console.log("NF0RX_byte GBpS:" + sub_string);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                });
        },interval_timer);

        //nf1 rx
        setInterval(function() {
            child = exec('rdaxi ' + nf1_rx_reg,
                function (error, stdout, stderr) {
                    //	socket.on('real time Chart', function() {
                    //		io.emit();
                    //	}
                    var NF1_RX_byte = 0;
                    var sub_string = stdout.split('=');
                    if(sub_string.length < 2){
                        //console.log("No data to send!!!")
                            var send_data = [6,new Date().getTime(),0];
                        io.emit('realtime Chart', send_data);
                    } else {
                        var sub_string1 = sub_string[1].split('\n');
                        var sub_string2 = sub_string1[0].split('x');
                        var value = sub_string2[1].split('');

                        var reverse_value = value.reverse();

                        for (var k = 0; k < reverse_value.length; k++) {
                            NF1_RX_byte += hex2dec(reverse_value[k])* Math.pow(16,k);
                        }
                        NF1_RX_byte = NF1_RX_byte*GbpS_ratio;
                        var send_data = [];
                        send_data.push(6);
                        send_data.push(new Date().getTime());
                        send_data.push(NF1_RX_byte);
                        io.emit('realtime Chart', send_data);
                    }
                    //console.log("NF1RX_byte GBpS:" + sub_string);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                });
        },interval_timer);
        //nf2 rx
        setInterval(function() {
            child = exec('rdaxi ' + nf2_rx_reg,
                function (error, stdout, stderr) {
                    //	socket.on('real time Chart', function() {
                    //		io.emit();
                    //	}
                    var NF2_RX_byte = 0;
                    var sub_string = stdout.split('=');
                    if(sub_string.length < 2){
                        //console.log("No data to send!!!")
                            var send_data = [7,new Date().getTime(),0];
                        io.emit('realtime Chart', send_data);
                    } else {
                        var sub_string1 = sub_string[1].split('\n');
                        var sub_string2 = sub_string1[0].split('x');
                        var value = sub_string2[1].split('');

                        var reverse_value = value.reverse();

                        for (var k = 0; k < reverse_value.length; k++) {
                            NF2_RX_byte += hex2dec(reverse_value[k])* Math.pow(16,k);
                        }
                        NF2_RX_byte = NF2_RX_byte*GbpS_ratio;
                        var send_data = [];
                        send_data.push(7);
                        send_data.push(new Date().getTime());
                        send_data.push(NF2_RX_byte);
                        io.emit('realtime Chart', send_data);
                    }
                    //console.log("NF2RX_byte GBpS:" + sub_string);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                });
        },interval_timer);
        //nf3 rx
        setInterval(function() {
            child = exec('rdaxi ' + nf3_rx_reg,
                function (error, stdout, stderr) {
                    //	socket.on('real time Chart', function() {
                    //		io.emit();
                    //	}
                    var NF3_RX_byte = 0;
                    var sub_string = stdout.split('=');
                    if(sub_string.length < 2){
                        //console.log("No data to send!!!")
                            var send_data = [8,new Date().getTime(),0];
                        io.emit('realtime Chart', send_data);
                    } else {
                        var sub_string1 = sub_string[1].split('\n');
                        var sub_string2 = sub_string1[0].split('x');
                        var value = sub_string2[1].split('');

                        var reverse_value = value.reverse();

                        for (var k = 0; k < reverse_value.length; k++) {
                            NF3_RX_byte += hex2dec(reverse_value[k])* Math.pow(16,k);
                        }
                        NF3_RX_byte = NF3_RX_byte*GbpS_ratio;                    //need to be update
                        var send_data = [];
                        send_data.push(8);
                        send_data.push(new Date().getTime());
                        send_data.push(NF3_RX_byte);
                        io.emit('realtime Chart', send_data);
                    }
                    //console.log("NF3RX_byte GBpS:" + sub_string);
                    if (error !== null) {
                        console.log('exec error: ' + error);
                    }
                });
        },interval_timer);

        /* BINH ADDED [END]*/
        setInterval(function() {
            var data_schedule = [];

            db.query('SELECT * FROM `schedule` where status="waiting" and date="'+ today +'"')
            .on('result', function(data){
                data_schedule.push(data);
            })
        .on('end', function(){
            //console.log("schedule"+data_schedule.length);
            for(var i = 0; i< data_schedule.length; i++) {
                var now = new Date();
                var schedule_time = new Date(data_schedule[i].date +" "+ data_schedule[i].time);
                //console.log(schedule_time);
                //console.log(now);
                if( now >= schedule_time) {
                    // Run some command to start ClamAV software
                    if(isSchedule_running == 1) {
                        console.log("The schedule is rejected by another schedule is running!!!")
            var query_status_rejected = 'UPDATE schedule SET status="rejected" WHERE id='+data_schedule[i].id;
        db.query(query_status_rejected);
        continue;
                    }

                    id_schedule = data_schedule[i].id;
                    var query_status_running = 'UPDATE schedule SET status="running" WHERE id='+data_schedule[i].id;
                    db.query(query_status_running);

                    console.log("Schedule is running...")
                        var command = '/home/netfpga/thainguyen/working_space_HW/clamav_bbf/run.sh '+ data_schedule[i].scan_link;
                    console.log(command);
                    schedule = exec(command,
                            //schedule = exec('ls',
                             function (error, stdout, stderr) {
                                 isSchedule_running = 1;
                                 console.log(stdout);
                                 if (error !== null) {
                                     console.log('exec error_schedule: ' + error);
                                 } else {
                                     isSchedule_running = 0;
                                     var query_status_completed = 'UPDATE schedule SET status="completed" WHERE id='+ id_schedule;
                                     db.query(query_status_completed);

                                     var query = 'INSERT INTO notification (name,link,time,date) VALUES ("New Scan","/scansummary","'+getTimeNow() +'","'+getDateNow()+'")';
                                     db.query(query);

                                     console.log("Bingo!!!");
                                 }
                             });
                            }
                            }
                            });
        },interval_timer);
        number_realtimechart--;
    }
    // Schedule Feature
    // Every 1s, check schedule and scan number. Then send to dashboad.js
    if(socketCount == 1) {
        setInterval(function() {
            var data_schedule = [];
            db.query('SELECT * FROM `schedule` where status="waiting" and date="'+ today +'"')
            .on('result', function(data){
                data_schedule.push(data);
            })
        .on('end', function(){
            //console.log("schedule"+data_schedule.length);
            socket.emit('update number schedule client', data_schedule.length);
        });

        var data_scan = [];
        db.query('SELECT * FROM `scan_sumary` where (time LIKE "%'+ today_scan +'%")')
            .on('result', function(data){
                data_scan.push(data);
            })
        .on('end', function(){
            //console.log("scan_"+ data_scan.length);
            socket.emit('update number scan client', data_scan.length);
        })

        var notification_data = [];
        db.query('SELECT * FROM `notification`')
            .on('result', function(data){
                // Push results onto the notes array

                notification_data.push(data);
                //console.log(notification_data.length);
            })
        .on('end', function(){
            // Only emit notes after query has been completed
            //console.log(notification_data.length);
            socket.emit('update notification', notification_data)
        })

        },interval_timer);
        socketCount--;
    }
    /*
     * update number of SCHEDULE and SCAN

     * check schedule - if YES, run it
     * time = 1000
     */



    // Update feature

    socket.on('check bitfile running',function(checkbit) {
        console.log(checkbit);
        child = exec('rdaxi 0x78200000', function (error, stdout, stderr) {
            var data;
            //var FPGA_speed = 0;
            console.log(stdout);
            stdout.trim();
            var sub_string = stdout.split('=');
            if(sub_string.length < 2){
                console.log("Failed!!");
                socket.emit('check bitfile running',"");
            } else {
                var sub_string1 = sub_string[1].split('\n');
                if(sub_string1[0] == '0x11061830'){ //Vu_PCIs_with_virus
                    data = 'ver1';
                    socket.emit('check bitfile running', "ver1_running");
                } else if(sub_string1[0] == '0x11191730'){ // Vu_PCIs_without_virus
                    data = 'ver2';
                    socket.emit('check bitfile running', "ver2_running");
                } else if(sub_string1[0] == 'waiting info from Designer') //
            socket.emit('check bitfile running',"ver3_running");
                else {
                    socket.emit('check bitfile running',"ver3_running");
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

    //Schedule Feature
    socket.on('new schedule', function(schedule_data){
        console.log(schedule_data.date);
        console.log(schedule_data.link);
        var data_schedule =[];
        db.query('SELECT * FROM `schedule` where date="'+schedule_data.date+'" and time="'+ schedule_data.time +'"')
        .on('result', function(data){
            data_schedule.push(data);
        })
    .on('end', function(){
        if(data_schedule.length > 0) {
            socket.emit('new schedule', "Failed!!! This time has been scheduled!!!");
        }
        else {
            var query = 'INSERT INTO schedule (date,time,request_id,scan_link,status) VALUES ("'+ schedule_data.date+'","'+ schedule_data.time +'",1,"'+schedule_data.link +'","waiting")';
            db.query(query);

            query = 'INSERT INTO notification (name,link,time,date) VALUES ("New Schedule","/schedule","'+getTimeNow() +'","'+getDateNow()+'")';
            db.query(query);
            socket.emit('new schedule', "success");
        }

    })
    });

    //Events Feature
    socket.on('event', function(data){
        console.log("events is coming-----------");
        var result_rows = [];

        db.query('SELECT * FROM events',function(err,rows){
        if(err) throw err;

        console.log('Data received from Db:\n');
        console.log(rows);
      });

    });

// run scan by command line
if( scan_by_admin == 1) {
    console.log("Run scan by admin");
    //tx = exec('/home/netfpga/thainguyen/working_space_HW/clamav_bbf/run.sh /home/netfpga/thainguyen/test/test_600MB.elf',
    tx = exec('',
            function (error, stdout, stderr) {
                console.log(stdout);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });
    scan_by_admin--;
}
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
    var today = d.getDate()+ "/"+ (d.getMonth()+1)+"/" +d.getFullYear();
    return today;
}

http.listen(3003, function(){
    console.log('listening on *:3003');
});
