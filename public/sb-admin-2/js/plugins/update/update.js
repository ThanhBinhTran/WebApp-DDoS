var socket = io();

var bitfiles_table;
var status_bitfiles = [];
//get bitfiles information
socket.emit('get bitfiles information','');

socket.on('bitfile records',function(result_rows) {

	bitfiles_table = '<table id="bitfles_table" class="table table-striped table-hover">';
	bitfiles_table += '<th>version</th><th>Name</th><th>Description</th><th>Create date</th><th>Uploaded date</th><th>Status</th><th>Action</th>';
  console.log("BUILDING TABLE " + result_rows.length);
	for (var i = 0; i < result_rows.length; i++) {
		 status_bitfiles.push(result_rows[i].version);
		 console.log(status_bitfiles);
     bitfiles_table +='<tr><td>' + result_rows[i].version + '</td><td>'
												 + result_rows[i].name + '</td><td>'
												 + result_rows[i].Description+ '</td><td>'
												 + result_rows[i].create_datetime  + '</td><td>'
												 + result_rows[i].last_Upload_datetime + '</td><td>'
												 + '<label id="status_' + status_bitfiles[i] + '" style="color: red"></label></td><td>'
												 + '<button type="button" class="btn btn-success" onclick="update('+result_rows[i].version+');"> Update </button> </td></tr>';
	};
	bitfiles_table += '</table>';
	$('#bitfiles-table').html(bitfiles_table);
});

//check which bitfile is running
socket.emit('check bitfile running','');

//get version of bitfile which is running
socket.on('version running',function(data) {
	console.log ("version running from server is " + data);
	for(var i = 0 ; i < status_bitfiles.length; i++){
		console.log(i + "print status bitfiles " + status_bitfiles[i]);
		if(status_bitfiles[i] == data){
			document.getElementById('status_'+status_bitfiles[i]).innerHTML = 'Running';
		}else {
			document.getElementById('status_'+status_bitfiles[i]).innerHTML = '';
		}
	}
	console.log(bitfiles_table);
});

// Update bitfile when user click to button

function OnDialog(status) {
	//console.log(file_name);
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

function update(version) {
	console.log("UPDATE BITFILE WITH VERSION " + version);
	socket.emit('update bitfile','version');
}


function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    displayContents(contents);
  };
  reader.readAsText(file);
}
// Dialog section
