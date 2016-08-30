var socket = io();

var notification_new;
var notification_dismiss;

$('#notification-dismiss').html(notification_dismiss);
$('#notification-new').html(notification_new);

//send notification
socket.emit('notification', '');

//receive new notification data
socket.on('new notification results',function(result_rows){
        notification_new = '<table class="table table-striped table-hover">';
	notification_new +="<th> Date</th><th> Time</th><th> Notification Name</th><th> Description</th>";
	for (var i = 0; i < result_rows.length; i++) {
	notification_new +="<tr><td>" + result_rows[i].date + "</td><td>" + result_rows[i].time + "</td>" +
                            "<td>" + result_rows[i].name + "</td><td>" + result_rows[i].desc + "</td></tr>";
	};
	notification_new += "</table>";
 	$('#notification-new').html(notification_new);
});

//receive diss notification data
socket.on('dismiss notification results',function(result_rows){
        notification_dismiss  = '<table class="table table-striped table-hover">';
	notification_dismiss += "<th> Date</th><th> Time</th><th> Notification Name</th><th> Description</th>";
	for (var i = 0; i < result_rows.length; i++) {
	notification_dismiss +="<tr><td>" + result_rows[i].date + "</td><td>" + result_rows[i].time + "</td>" +
                            "<td>" + result_rows[i].name + "</td><td>" + result_rows[i].desc + "</td></tr>";
	};
	notification_dismiss += "</table>";
	$('#notification-dismiss').html(notification_dismiss);
});

