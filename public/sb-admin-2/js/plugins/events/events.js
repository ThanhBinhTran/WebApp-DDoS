var socket = io();

var d = new Date();
var date_default = d.getFullYear()+ "-" + (d.getMonth()+1) + "-" + d.getDate(); 
$('#date').val(date_default);
var time_default = d.getHours() + ":" + d.getMinutes();
$('#time').val(time_default);

var now = d; 
$('form').submit(function(){
	var schedule_data = [];
	var date = $('#date').val() ;
	var time = $('#time').val() ;
	var link = $('#link').val();
	var command = $('#command').val();

	d = new Date(date +" "+ time);
	if( d < now){
		alert("The time is in the past!!!")
	}
	else {
    		socket.emit('new schedule', { date: date, time: time, link: link, command: command});

    //$('#m').val('');
	}
    return false;
});

socket.on('new schedule', function(msg){
	alert(msg);
})
function pushDataToDB() {
	

}
