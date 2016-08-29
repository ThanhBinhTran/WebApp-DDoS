var socket = io();

var event_new = [];
var event_dismiss = [];

var d = new Date();
var date_default = d.getFullYear()+ "-" + (d.getMonth()+1) + "-" + d.getDate();
$('#date').val(date_default);
var time_default = d.getHours() + ":" + d.getMinutes();
$('#time').val(time_default);

var now = d;
var date = $('#date').val() ;

$('#event-new').html(event_new);
$('#event-dismiss').html(event_dismiss);

//send event
socket.emit('event', '');

//receive data
socket.on('event results',function(result_rows){
		console.log("binh tran ")
	for (var i = 0; i < result_rows.length; i++) {
		console.log("Binh: " + result_rows[i].name + "__" + result_rows[i].status);
	};
});
