var socket = io();

var event_new;
var event_dismiss;

$('#event-dismiss').html(event_dismiss);
$('#event-new').html(event_new);

//send event
socket.emit('event', '');

//receive new event data
socket.on('new event results',function(result_rows){
        event_new = '<table class="table table-striped table-hover">';
	event_new += "<th> Date</th><th> Time</th><th> Alert Name</th><th> Description</th>";
	for (var i = 0; i < result_rows.length; i++) {
	event_new +="<tr><td>" + result_rows[i].date + "</td><td>" + result_rows[i].time + "</td>" +
                            "<td>" + result_rows[i].name + "</td><td>" + result_rows[i].desc + "</td></tr>";
	};
	event_new += "</table>";
 	$('#event-new').html(event_new);
});

//receive diss event data
socket.on('dismiss event results',function(result_rows){
        event_dismiss  = '<table class="table table-striped table-hover">';
	event_dismiss += "<th> Date</th><th> Time</th><th> Alert Name</th><th> Description</th>";
	for (var i = 0; i < result_rows.length; i++) {
	event_dismiss +="<tr><td>" + result_rows[i].date + "</td><td>" + result_rows[i].time + "</td>" +
                            "<td>" + result_rows[i].name + "</td><td>" + result_rows[i].desc + "</td></tr>";
	};
	event_dismiss += "</table>";
	$('#event-dismiss').html(event_dismiss);
});

