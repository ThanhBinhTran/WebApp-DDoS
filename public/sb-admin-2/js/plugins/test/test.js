
Requests = {
QueryString : function(item){
var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)","i"));
return svalue ? svalue[1] : svalue;
}
}

//usage
var id = (Requests.QueryString("id"));

var socket = io();

var html_contain ="";
var top_contain = document.getElementById("top_contain");
socket.on('initial notes',function(data) {
	if ( id > 0) {
		for(var i = 0; i < data.length; i++) {
			if(data[i].id == id) {
				html_contain = "<table id='topcontain_table' class='table table-hover'> ";
				html_contain += "<tr><td> Time scan</td> <td> " + data[i].time + "</td></tr>";
				html_contain += "<tr><td> Known viruses</td> <td> " + data[i].known_viruses + "</td></tr>";
				html_contain += "<tr><td> Engine version</td> <td>" + data[i].engine_version + "</td></tr>";
				html_contain += "<tr><td> Scanned directories</td> <td> " + data[i].scanned_directories + "</td></tr>";
				html_contain += "<tr><td> Scanned files</td> <td> " + data[i].scanned_files+ "</td></tr>";
				html_contain += "<tr><td> Infected files</td> <td> " + data[i].infected_files + "</td></tr>";
				html_contain += "<tr><td> Data scanned</td> <td> " + data[i].data_scanned + "</td></tr>";
				html_contain += "<tr><td> Data read</td> <td> " + data[i].data_read + "</td></tr>";
				html_contain += "<tr><td> Static scan time</td> <td> " + data[i].static_scan_time + "</td></tr>";
				html_contain += "<tr><td> Static scan speed </td> <td> " + data[i].static_scan_speed + "</td></tr>";
				html_contain += "<tr><td> Dynamic scan time </td> <td> " + data[i].dynamic_scan_time + "</td></tr>";
				html_contain += "<tr><td> Dynamic scan speed </td> <td> " + data[i].dynamic_scan_speed + "</td></tr>";
				html_contain += "<tr><td> System time</td> <td> " + data[i].system_time + "</td></tr>";
				//html_contain += "<tr><td> Scan time</td> <td> " + data[i].scan_time + "</td></tr>";
				html_contain += "<tr><td> Scan speed</td> <td> " + data[i].system_speed + "</td></tr>";
				html_contain += "</table>";
				html_contain += "</br> </br>";
				break;
			}
		}
		$('#top_contain').html(html_contain);
		$(document).ready(function() {$('#topcontain_table').dataTable();});
	}
});
var html = "";
var scan_sumary_div = document.getElementById("scan_sumary_div");

	if( id > 0){	
		socket.on('view sumary detail',function(data) {
		if( id > 0){		
			html = "<h3> Scan sumary detail </h3>";
			html += "</br>";
			html += "<table id='scan_sumary_detail' class='table table-striped table-bordered table-hover'>";
			html +="<thead> <tr>";
			html += "<th> STT </th>";
			html += "<th> TIME</th>";
			html += "<th> FILE </th>";
			html += "<th> STATUS </th>";
			html += "<th> VIRUS NAME </th>";
			html += " </tr> </thead> ";		
			html += "<tbody>";
			var index = 1;
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
			//alert(html);
			$('#scan_sumary_div').html(html);
			//$('#dataTables2').ready(function(){dataTable();});
			$(document).ready(function() {$('#scan_sumary_detail').dataTable();});
		}
		});
	}  else {
		socket.on('initial notes',function(data) {
			if(data.length <= 0){
				//$('#messages').html("The result is empty");
			} else {
				    html = "<table id='scan_sumary' class='table table-bordered table-hover'>";
					html +="<thead> <tr>";
					html += "<th> STT </th>";
					html += "<th> Time </th>";
					html += "<th> Known viruses </th>";
					//html += "<th> Version </th>";
					html += "<th> Scan dir </th>";
					html += "<th> Scan files </th>";
					html += "<th> Inf files </th>";
					html += "<th> Data scanned </th>";
					html += "<th> System time(s) </th>";
					//html += "<th> Scan time(s) </th>";
					html += "<th> System speed </th>";
					html += "<th> Detail </th>";
					html += " </tr> </thead> ";
					
					html += "<tbody>";
				for (var i = 0; i < data.length; i++){	
					html += "<tr>";
					html += "<td>" + (i+1) + "</td>";
					html += "<td>" + data[i].time + "</td>";
					html += "<td>" + data[i].known_viruses + "</td>";
					//html += "<td>" + data[i].engine_version + "</td>";
					html += "<td>" + data[i].scanned_directories + "</td>";
					html += "<td>" + data[i].scanned_files + "</td>";
					html += "<td>" + data[i].infected_files + "</td>";
					var sub_data_scanned = data[i].data_scanned.split("(");
					html += "<td>" + sub_data_scanned[0] + "</td>";
					//var sub_data_read = data[i].data_read.split("(");
					//html += "<td style='text-align: center;'>" + sub_data_read[0] + "</td>";
					var sub_system_time = data[i].system_time.split(" ");
					html += "<td>" + sub_system_time[0] + "</td>";
					//var sub_scan_time = data[i].scan_time.split(" ");
					//html += "<td>" + sub_scan_time[0] + "</td>";
					var sub_system_speed = data[i].system_speed.split("(");
					html += "<td>" + sub_system_speed[0] + "</td>";
					html += "<td> <a href='/scansummary?id="+data[i].id+"'> More</a>  </td>";
					html += "</tr>";
				}	
				html += "</tbody>";
				html += "</table>";	
				$('#scan_sumary_div').html(html);
			    $(document).ready(function() {$('#scan_sumary').dataTable();});				
			}
		});
		
		//
	}	
//$(document).ready(function() {$('#dataTables').dataTable();});
//$(document).ready(function() {$('#dataTables1').dataTable();});
socket.on('chat message', function(msg){
	$('#messages').append($('<li>').text(msg));
});
socket.on('User Connected', function(data){
	$('#usersConnected').append("Users Connected: " + data);
});
//var NuocLanh = document.getElementById("NuocLanh");
//var html;
/*
var myVar=setInterval(function () {myTimer()}, 1000);
function myTimer() {
    var d = new Date();
    document.getElementById("demo").innerHTML = d.toLocaleTimeString();
}
*/
