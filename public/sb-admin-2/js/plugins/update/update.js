var socket = io();

var runningstatus1 = "";
var runningstatus2 = "";
var runningstatus3 = "";

function build_table() {
	var table_update = '<table id="update_data_table" class="table table-striped table-hover">';
		table_update += '<th>STT</th>';
		table_update += '<th>Name</th>';
		table_update += '<th>Description</th>';
                table_update += '<th>Uploaded date</th>';
                table_update += '<th>Status</th>';
		table_update += '<th>Action</th>';
	
		table_update += '</tr>';
		table_update += '<tr>';
		table_update += '<td> 1 </td>';
		table_update += '<td> Full bitstream </td>';
		table_update += '<td> With HopCount and Port Ingess/Egress inside</td>';
                table_update += '<td> 2015</td>';
		table_update += '<td id="Full_bitstream" class="scanner_running">'+ runningstatus1+' </td>';	
		table_update += '<td><button type="" onclick="update(1);" > Update </button> </td>';	
		table_update += '</tr>';		

		table_update += '<tr>';
		table_update += '<td> 2 </td>';
		table_update += '<td> Partial IE 1</td>';
		table_update += '<td> IE filter 198.12.0.0, 192.168.0.0</td>';
                table_update += '<td> 2015</td>';
		table_update += '<td> <span id="partial_bitstream_v01" class="scanner_running">'+ runningstatus2+' </span>  </td>';	
		table_update += '<td> <button type="" onclick="update(2);"> Update </button></td>';	
		table_update += '</tr>';
	
		table_update += '<tr>';
		table_update += '<td> 3 </td>';
		table_update += '<td> Partial IE 2  </td>';
		table_update += '<td> IE accept 192.168.0.0, 198.12.0.0 </td>';
		table_update += '<td> 2016</td>';
                table_update += '<td> <div id="partial_bitstream_v01" class="scanner_running"> '+runningstatus3+'</div> </td>';	
		table_update += '<td> <button type="" onclick="update(3);"> Update </button> </td>';


		table_update += '</table>';
		table_update += '<div id="dialog" hidden> <img src="sb-admin-2/js/plugins/update/image/loading.gif"> </div>'
		//table_update += '<button type="" onclick="OnDialog(7622119);" > Open Dialog </button>';
		//table_update += '<button type="" onclick="OnDialog();" > Close Dialog </button>';	
	$('#update_contain').html(table_update);
	$(document).ready(function() {$('#update_data_table').dataTable();});
}

//build table in the first time

var nuoc = 1;
if(nuoc == 1 ) {
	socket.emit('check bitfile running','requet to update bitfile in the first time');
	socket.on('check bitfile running',function(data) {
		if(data == "ver1_running" ) {
			runningstatus1 = "Running";
			runningstatus2 = "";
			runningstatus3 = "";		
		} else if (data == "ver2_running"){
			runningstatus1 = "";
			runningstatus2 = "Running";
			runningstatus3 = "";
		} else {
			runningstatus1 = "";
			runningstatus2 = "";
			runningstatus3 = "Running";
		}
		build_table();		
	});
	//build_table();
}
else {
	alert("Why not me!!!")
}
// Update bitfile when user click to button

function OnDialog(status) {
if(status == 7622119) {
	$("#dialog").dialog({ 
		autoOpen: false,
		width: 450,
		height:'auto',
		//position: "top",
	    buttons: {
		"OK": function () {
		    $(this).dialog("close");
		}
	    }
	 });
	
//$('#dialog').dialog('option', 'position', 'center'); 
	  $( "#dialog" ).dialog("open");
	  $(".ui-dialog-titlebar").hide();
} else {
	 $( "#dialog" ).dialog("close");
}

}
function update(bitfile_id) {
	//alert(bitfile_id);
	OnDialog(7622119);
// send request	
	if( bitfile_id == 1){
		socket.emit('update bitfile','ver1');
	} else if (bitfile_id == 2 ) {
		socket.emit('update bitfile','ver2');
	} else if( bitfile_id == 3 ) {
		socket.emit('update bitfile','ver3');
	}

//receive response and update table
	//socket.emit('update bitfile',1);
	socket.on('update bitfile client', function(data) {
		//alert(data);
		OnDialog("");
		if(data == 'ver1_updated'){
			ver1 = "Running";
			ver2 = "";
			ver3 = "";	
			build_table();
		} else if (data == 'ver2_updated'){
			ver1 = "";			
			ver2 = "Running";			
			ver3 = "";
			build_table();
		} else if (data == 'ver3_updated'){ 
			ver1 = "";			
			ver2 = "";			
			ver3 = "Running";
			build_table();
		} else if(data == 'error'){
 			ver1 = "N/A";			
			ver2 = "N/A";			
			ver3 = "N/A";
                        build_table();
                }
                 
		
		//$('nuoc').html("ALOALO1123");		
		//$('nuoc02').html("ALOALO1123");
	});
}
// Dialog section


