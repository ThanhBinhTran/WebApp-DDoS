
Requests = {
QueryString : function(item){
var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)","i"));
return svalue ? svalue[1] : svalue;
}
}

//usage
var id = (Requests.QueryString("id"));

var socket = io();

$('form').submit(function(){
	if(id>0){
		socket.emit('Search', $('#m').val());
		$('#messages').html("");
	}
	else {
		socket.emit('Search', $('#m').val());
		$('#messages').html("");
	}
	return false;
});

socket.on('chat message', function(msg){
	$('#messages').append($('<li>').text(msg));
});
socket.on('User Connected', function(data){
	$('#usersConnected').append("Users Connected: " + data);
});
/*
var myVar=setInterval(function () {myTimer()}, 1000);
function myTimer() {
    var d = new Date();
    document.getElementById("demo").innerHTML = d.toLocaleTimeString();
}
*/

var html;
$('#messages').ready(function(){
	if( id > 0){
		socket.on('view sumary detail',function(data) {
		if(data.length <= 0){
			$('#messages').html("It does not have any info!!!");
		} else {
			html = "<table class='table table-striped table-bordered table-hover'>";
			html +="<thead> <tr>";
			html += "<th> STT </th>";
			html += "<th> TIME</th>";
			html += "<th> FILE </th>";
			html += "<th> STATUS </th>";
			html += "<th> VIRUS NAME </th>";
			html += " </tr> </thead> ";
			
			html += "<tbody>";
			var index = 1
			for (var i = 0; i < data.length; i++){	
				if(data[i].scan_sumary_id == id) {
					html += "<tr>";
					html += "<td>" + index + "</td>";
					html += "<td>" + data[i].time + "</td>";
					html += "<td>" + data[i].file + "</td>";
					html += "<td>" + data[i].status + "</td>";
					html += "<td>" + data[i].virus_name + "</td>";
					html += "</tr>";
					index++;
				}	
			}
			html += "</tbody>";
			html += "</table>";
			$('#messages').html(html);	
		}
		});
	} else {
		socket.on('initial notes',function(data) {
			if(data.length <= 0){
				$('#messages').html("The result is empty");
			} else {
				    html = "<table class='table table-bordered table-hover'>";
					html +="<thead> <tr>";
					html += "<th> STT </th>";
					html += "<th> Time </th>";
					html += "<th> Known viruses </th>";
					html += "<th> Version </th>";
					html += "<th> Scan dir </th>";
					html += "<th> Scan files </th>";
					html += "<th> Inf files </th>";
					html += "<th> Data scanned </th>";
					//html += "<th> Data read </th>";
					html += "<th> System time(s) </th>";
					html += "<th> Scan time(s) </th>";
					html += "<th> Scan speed </th>";
					html += "<th> Detail </th>";
					html += " </tr> </thead> ";
					
					html += "<tbody>";
				for (var i = 0; i < data.length; i++){	
					html += "<tr>";
					html += "<td>" + (i+1) + "</td>";
					html += "<td>" + data[i].time + "</td>";
					html += "<td>" + data[i].known_viruses + "</td>";
					html += "<td>" + data[i].engine_version + "</td>";
					html += "<td>" + data[i].scanned_directories + "</td>";
					html += "<td>" + data[i].scanned_files + "</td>";
					html += "<td>" + data[i].infected_files + "</td>";
					var sub_data_scanned = data[i].data_scanned.split("(");
					html += "<td>" + sub_data_scanned[0] + "</td>";
					//var sub_data_read = data[i].data_read.split("(");
					//html += "<td style='text-align: center;'>" + sub_data_read[0] + "</td>";
					var sub_system_time = data[i].system_time.split(" ");
					html += "<td>" + sub_system_time[0] + "</td>";
					var sub_scan_time = data[i].scan_time.split(" ");
					html += "<td>" + sub_scan_time[0] + "</td>";
					var sub_scan_speed = data[i].scan_speed.split("(");
					html += "<td>" + sub_scan_speed[0] + "</td>";
					html += "<td> <a href='/test?id="+data[i].id+"'>See more</a>  </td>";
					
/*					
					$('#messages').append($('<td>').text(data[i].time));
					$('#messages').append($('<td style="text-align: right;">').text(data[i].known_viruses));
					$('#messages').append($('<td style="text-align: right;">').text(data[i].engine_version));
					$('#messages').append($('<td style="text-align: right;">').text(data[i].scanned_directories));
					$('#messages').append($('<td style="text-align: right;">').text(data[i].scanned_files));
					$('#messages').append($('<td style="text-align: right;">').text(data[i].infected_files));
					var sub_data_scanned = data[i].data_scanned.split("(");
					$('#messages').append($('<td style="text-align: right;">').text(sub_data_scanned[0]));
					var sub_data_read = data[i].data_read.split("(");
					$('#messages').append($('<td style="text-align: right;">').text(sub_data_read[0]));
					var sub_system_time = data[i].system_time.split("(");
					$('#messages').append($('<td>').text(sub_system_time[0]));
					$('#messages').append($('<td>').text(data[i].scan_time));
					var sub_scan_speed = data[i].scan_speed.split("(");
					$('#messages').append($('<td>').text(sub_scan_speed[0]));
					//$('#messages').append("<td> <input class='test_click' type='checkbox' value='"+data[i].id+"' />  </td>");
					$('#messages').append("<td> <a href='/test?id="+data[i].id+"'>See more</a>  </td>");
*/	
					html += "</tr>";
				}	
				html += "</tbody>";
				html += "</table>";	
				$('#messages').html(html);			
			}
		});
		
		//
	}
});



var NL_html ="";
NL_html = '<table id="NuocLanh_table" class="table table-striped table-bordered table-hover">';
NL_html +=					'<thead>';
NL_html +=                        '<tr>';
NL_html +=                            '<th>STT</th>';
NL_html +=                            '<th>Họ Tên</th>';
NL_html +=                            '<th>Giới tính</th>';
NL_html +=                            '<th>Email</th>';
NL_html +=                            '<th>Địa chỉ</th>';
NL_html +=                        '</tr>';
NL_html +=                    '</thead>';
NL_html +=                    '<tbody>';
NL_html +=                        '<tr>';
NL_html +=                            '<td>1</td>';
NL_html +=                           '<td>Văn Cường</td>';
NL_html +=                            '<td>Nam</td>';
NL_html +=                           '<td>thehalftheart@mail.com</td>';
NL_html +=                            '<td>192 Hầm tử</td>';
NL_html +=                        '</tr>';
 NL_html +=                       '<tr>';
 NL_html +=                           '<td>2</td>';
 NL_html +=                           '<td>Hoài Minh</td>';
 NL_html +=                           '<td>Nam</td>';
 NL_html +=                           '<td>hoaiminhit1990@mail.com</td>';
 NL_html +=                           '<td>192 Hầm tử</td>';
 NL_html +=
 NL_html +=                       '</tr>';
 NL_html +=                       '<tr>';
 NL_html +=                           '<td>3</td>';
 NL_html +=                           '<td>Quốc Minh</td>';
 NL_html +=                           '<td>Nam</td>';
 NL_html +=                           '<td>quocminh@mail.com</td>';
 NL_html +=                           '<td>192 Hầm tử</td>';
 NL_html +=
 NL_html +=                       '</tr>';
 NL_html +=                   '</tbody>';
 NL_html +=               '</table>';

//var NuocLanh = document.getElementById("NuocLanh");
//NuocLanh.innerHTML ="";
//NuocLanh.innerHTML = html;
//$(document).ready(function() {$('#dataTables').dataTable();});
/*
$('#see_more').ready(function(){
	socket.on('initial notes',function(data) {
	
	});
});	
/*
$(document).ready(function(){
socket.on('initial notes',function(data) {
	$('#messages').append($('<li>').text(data.length));
	for (var i = 0; i < data.length; i++){
		$('#messages').append($('<li>').text(data[i].time));
	}
});
};

/*
 ( function($) {
  $(document).ready( function() { alert("nyah nyah! I'm able to use '$'!!!!");  } );
 } )
 */