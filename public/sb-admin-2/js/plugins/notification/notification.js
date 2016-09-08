var socket = io();

var notification_new;
var notification_dismiss;
var dismiss_all_button;

    dismiss_all_button = '<button type="button" class="btn btn-success btn-sm" onclick="dismiss_all_notification();"> Dismisll all </button>';

$('#notification-dismiss').html(notification_dismiss);
$('#notification-new').html(notification_new);
$('#dismiss-all-button').html(dismiss_all_button);
//send notification
socket.emit('notification', '');

//receive new notification data
socket.on('new notification results',function(result_rows){
  notification_new  = '<div style="height: 500px; overflow-y: auto">';
  notification_new += '<table class="table table-striped table-hover">';
	notification_new += '<th> Date time</th><th> Notification Name</th><th> Description</th>';
	for (var i = 0; i < result_rows.length; i++) {
	   notification_new += '<tr><td>' + result_rows[i].datetime + '</td><td>'
                                + result_rows[i].name + '</td><td>' + result_rows[i].desc + '</td></tr>';
	};
	notification_new += '</table></div>';
 	$('#notification-new').html(notification_new);
});

//receive diss notification data
socket.on('dismiss notification results',function(result_rows){
  notification_dismiss  = '<div style="height: 500px; overflow-y: auto">';
  notification_dismiss += '<table class="table table-striped table-hover">';
	notification_dismiss += '<th> Date time</th><th> Notification Name</th><th> Description</th>';
	for (var i = 0; i < result_rows.length; i++) {
	   notification_dismiss +='<tr><td>' + result_rows[i].datetime + '</td><td>'
                                    + result_rows[i].name + '</td><td>' + result_rows[i].desc + '</td></tr>';
	};
	notification_dismiss += '</table>';
	$('#notification-dismiss').html(notification_dismiss);
});

function dismiss_all_notification() {
  socket.emit('dismiss all notification', '');
  socket.emit('notification', '');
}
