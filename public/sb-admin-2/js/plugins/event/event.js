var socket = io();

var event_new;
var event_dismiss;
var dismiss_all_button = '<button type="button" class="btn btn-success btn-sm" onclick="dismiss_all_event();"> Dismisll all </button>';

$('#event-dismiss').html(event_dismiss);
$('#event-new').html(event_new);
$('#dismiss-all-button').html(dismiss_all_button);

//send event
socket.emit('event', '');

//receive new event data
socket.on('new event results',function(result_rows){
  event_new  = '<div style="height: 500px; overflow-y: auto">';
  event_new += '<table class="table table-striped table-hover">';
	event_new += '<th> Date time</th><th> Alert Name</th><th> Description</th>';
	for (var i = 0; i < result_rows.length; i++) {
	event_new +="<tr><td>" + result_rows[i].datetime + "</td><td>"
                         + result_rows[i].name + "</td><td>" + result_rows[i].desc + "</td></tr>";
	};
	event_new += "</table></div>";
 	$('#event-new').html(event_new);
});

//receive dismiss event data
socket.on('dismiss event results',function(result_rows){
  event_dismiss  = '<div style="height: 500px; overflow-y: auto">';
  event_dismiss += '<table class="table table-striped table-hover">';
	event_dismiss += "<th> Date time</th><th> Alert Name</th><th> Description</th>";
	for (var i = 0; i < result_rows.length; i++) {
	event_dismiss +="<tr><td>" + result_rows[i].datetime + "</td><td>"
                             + result_rows[i].name + "</td><td>" + result_rows[i].desc + "</td></tr>";
	};
	event_dismiss += "</table></div>";
	$('#event-dismiss').html(event_dismiss);
});

function dismiss_all_event() {
  socket.emit('dismiss all event', '');
  socket.emit('event', '');
}
