var alerts;
var notifications;


$('#new_notifications').html(notifications);
$('#new_alerts').html(alerts);

//send event
socket.emit('new_alerts', '');

//receive new event data
socket.on('new_alerts results',function(result_rows){
	alerts = result_rows.length;
 	$('#new_alerts').html(alerts);
});

socket.on('new_alerts added',function(data){
	alerts = alerts +1;
 	$('#new_alerts').html(alerts);
});
//send event
socket.emit('new_notifications', '');

//receive new event data
socket.on('new_notifications results',function(result_rows){
	notifications = result_rows.length;
 	$('#new_notifications').html(notifications);
});
