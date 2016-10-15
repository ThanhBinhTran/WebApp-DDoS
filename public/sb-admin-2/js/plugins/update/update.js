var socket = io();

var bitfiles_table;
var status_bitfiles = [];

var loading_sceen = '<div id="dialog" hidden> <img src="sb-admin-2/js/plugins/update/image/loading.gif"> </div>' +
					//'<button type="button" class="btn btn-success" onclick="OnDialog(true);"> open </button>'  +
					//'<button type="button" class="btn btn-success" onclick="OnDialog(false);"> close </button>' +
					//'<button class="btn btn-success" data-toggle="modal" data-target="#my-modal">Launch Modal</button>' + 
					'<div class="modal" id="my-modal"> <!-- this is modal div -->' + 
					'<div class="modal-dialog modal-md">' + 
					'<div class="modal-content">' + 
					'<div class="modal-header">' + 
					'<button class="close" data-dismiss="modal">x</button> <!-- put `data-target="#my-modal"` in? -->' + 
					'<h4 class="modal-title">Hello User!</h4>' + 
					'</div>' + '<div class="modal-body">' + 'lcome our dear user of our website!' + '</div>' +
					'<div class="modal-footer">' + 
					'<button class="btn btn-default" data-dismiss="modal">Dismiss</button> <!-- put `data-target="#my-modal"` in? -->' +
					'<button class="btn btn-success">Save Changes</button>' +
					'</div> </div> </div>';
$('#loading-sceen').html(loading_sceen);

//get bitfiles information
socket.emit('get bitfiles information','');

socket.on('bitfile records',function(result_rows) {

	bitfiles_table = '<table id="bitfles_table" class="table table-striped table-hover">';
	bitfiles_table += '<th>Version</th><th>Name</th><th>Description</th><th>Created date</th><th>Uploaded date</th><th>Status</th><th>Action</th>';
  	//console.log("BUILDING TABLE " + result_rows.length);
	for (var i = 0; i < result_rows.length; i++) {
		 status_bitfiles.push(result_rows[i].version);
		 //console.log(status_bitfiles);
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
	var runningVersion;
	var mismatch = true;
	console.log ("version running from server is " + data);
	runningVersion = convertHexToversion(data);
	for(var i = 0 ; i < status_bitfiles.length; i++){
		//console.log(i + "print status bitfiles " + status_bitfiles[i]);
		if(status_bitfiles[i] == runningVersion){
			mismatch = false;
			document.getElementById('status_'+status_bitfiles[i]).innerHTML = 'Running';
		}else {
			document.getElementById('status_'+status_bitfiles[i]).innerHTML = '--';
		}
	}
	if(mismatch){
		console.log("Mismatch or notfound bitfile");
		var bitfile_notFound = '<div class="alert alert-danger"><strong > ERROR! </strong></br>' +
		                          'Bitfile not found or mismatch version.</br>' +
		                          '  1. Please download bitfile again or</br>' +
		                          '  2. Register bitfile informations to database</div>';

		$('#bitfile-notFound').html(bitfile_notFound);
	}
	else{
		console.log("Found bitfile with version" + runningVersion);
		$('#bitfile-notFound').html('');
	}
	//console.log(bitfiles_table);
});

// Update bitfile when user click to button
function convertHexToversion(hexData){
	var data = hexData.split("x");
	var return_val = 0;
	var dataStr = String(data[1]);
	if(dataStr == '0'){
		console.log("NOT FOUND OR MISMATCH bitfile");
		return_val = 0;
	}else {

		var version = parseInt(dataStr.substring(1, dataStr.length-5));
		var subversion = parseInt(dataStr.substring(dataStr.length-4, dataStr.length));
		console.log("version: " + version + "subversion: " + subversion);
		return_val = version + '.' + subversion;
	}
	return return_val;
}

function update(version) {
	console.log("UPDATE BITFILE WITH VERSION " + version);
	OnDialog(true);
	socket.emit('update bitfile',version);
	
}


socket.on('update bitfile done',function(data) {
	console.log ("update bitfile " + data);

	//get bitfiles information
	socket.emit('get bitfiles information','');

	//check which bitfile is running
	socket.emit('check bitfile running','');
	OnDialog("");
});

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
function OnDialog(status) {
	if(status == true) {
		$("#dialog").dialog({ 
			closeOnEscape: false
		});

		//$('#dialog').dialog('option', 'position', 'center'); 
		$( "#dialog" ).dialog("open");
		$(".ui-dialog-titlebar").hide();
	} else {
		$( "#dialog" ).dialog("close");
	}
}
