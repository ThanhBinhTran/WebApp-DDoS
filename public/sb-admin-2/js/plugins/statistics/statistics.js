var socket = io();
var html_contain ="";
var top_contain = document.getElementById("top_contain");
var html_seclect_button = "";
html_seclect_button  = "<button type='button' onclick='plot_virus();'> Virus </button>";
html_seclect_button += "<button type='button' onclick='plot_data();'> Data </button>";
$('#select-button').html(html_seclect_button);


var data_summary,data_summary_detail;
var i;
var data_virus;
function month2value(month) {
	switch (month) {
		case 'Jan':
			return 1;
			break;
		case 'Feb':
			return 2;
			break;
		case 'Mar':
			return 3;
			break;
		case 'Apr':
			return 4;
			break;
		case 'May':
			return 5;
			break;
		case 'June':
			return 6;
			break;
		case 'July':
			return 7;
			break;
		case 'Aug':
			return 8;
			break;
		case 'Sept':
			return 9;
			break;
		case 'Oct':
			return 10;
			break;
		case 'Nov':
			return 11;
			break;
		case 'Dec':
			return 12;
			
		default:
			return 1;
			break;
	}
}
function string2time(string) {
	string.trim();
	var res = string.split(" ");
	var res1 = res[2].split('/');
	var d = new Date(res1[2],res1[1]-1,res1[0],0,0,0);
	return d.getTime();
}

function init_data(start,end) {
	var data = [];
	var length = (end - start)/86400000 + 1;
	for (var i = 0; i < length; i++) {
		data.push([start + i*86400000,0]);
	}
	return data;
}
function string2data(string) {
 	string.trim();
	var res = string.split(" ");
	return res[0];
}
function str2num(val) {
  	val = '0' + val;
        val = parseFloat(val);
        return val;
}
function barchart_ticks(data) {
	var ticks = [];
	
	for (var i = 0; i < data.length; i++) {
		var date = new Date(data[i][0]);
		var days = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
		var months = date.getMonth()+1 < 10 ? "0" + date.getMonth()+1 : date.getMonth()+1;
		var years = date.getFullYear();		
		
		ticks.push([i, days+ "/" + months]);
	}
	return ticks;
}
function barchart_data( data) {
	var res = [];
	for (var i =0; i< data.length; i++ ) {
		res.push([i,data[i][1]]);
	}
	return res;
}
function plot_virus() {
	
	var start_time = string2time(data_summary_detail[0].time);
	var end_time = string2time(data_summary_detail[data_summary_detail.length-1].time);
	var current_time;
	var index;
	var plot_virus = init_data(start_time, end_time);

	for ( i = 0; i < data_summary_detail.length; i++){
		if(data_summary_detail[i].status == "FOUND") {
			current_time = 	string2time(data_summary_detail[i].time);		
			index = (current_time - start_time)/86400000;
			plot_virus[index][1]++;	
		}
	}
	var ticks = barchart_ticks(plot_virus);
	plot_virus = barchart_data(plot_virus);
	
	var options = {
            series: {
                bars: {
                    show: true
                }
            },
            bars: {
                align: "center",
                barWidth: 0.5,
            },
	    xaxis: {
		axisLabel: "Time",
		axisLabelUseCanvas: true,
		axisLabelFontSizePixels: 18,
		axisLabelFontFamily: 'Verdana, Arial',
		axisLabelPadding: 10,
		ticks: ticks,
	    },
	    yaxis: {
		min: 0,
		max: 20,        
		tickSize: 2,
		tickFormatter: function (v, axis) {
		    if (v % 2 == 0) {
		        return v;
		    } else {
		        return "";
		    }
		},
		axisLabel: "Num of virus",
		axisLabelUseCanvas: true,
		axisLabelFontSizePixels: 18,
		axisLabelFontFamily: 'Verdana, Arial',
		axisLabelPadding: 6
	    },
	    legend: {        
		labelBoxBorderColor: "#fff"
	    },
	    grid: {      
		hoverable: true,
		backgroundColor: {colors: ["#fff", "#e4f4f4"]},
		tickColor: "#008040",
			markings: function(axes) {
				var markings = [];
				var xaxis = axes.xaxis;
				for (var x = Math.floor(xaxis.min); x < xaxis.max; x += xaxis.tickSize * 2) {
					markings.push({
						xaxis: {
							from: x,
							to: x + xaxis.tickSize
						},
						color: "rgba(232, 232, 255, 0.2)"
					});
				}
				return markings;
			}		
	    }

	};
	var data = [];
	data.push({
		label:"Virus",
		data: plot_virus,
		color: "#FF0000",
		//points: { fillColor: "#FF0000", show: true, radius: 2 } 
	});
	$.plot($('#virus-plot'),data,options);

	var value_section = "";
	value_section += "<table id='virus_statistics_table' class='table table-bordered table-hover'>";
	value_section += "<thead> <tr>";
	value_section += "<th> STT </th>";
	value_section += "<th> Time </th>";
	value_section += "<th> Virus </th>";
	value_section += "</tr> </thead>";
	
	value_section += "<tbody>";
	for(i = 0; i < plot_virus.length; i++) {
		var d = new Date(plot_virus[i][0]);
		value_section += "<tr>";
		value_section += "<td>" + (i+1) + "</td>";
		value_section += "<td>" + d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + "</td>";
		//value_section += "<td>" + plot_data[i][0] +"</td>";
		value_section += "<td>" + plot_virus[i][1] + "</td>";
		value_section += "</tr>";
	}
	value_section += "</tbody>";
	value_section += "</table>";
	$('#value-section').html(value_section);
	$(document).ready(function() {$('#virus_statistics_table').dataTable();});
}

function plot_data() {
	var start_time = string2time(data_summary[0].time);
	var end_time = string2time(data_summary[data_summary.length-1].time);
	var current_time;
	var index=0;
	var i;
	var data_set = init_data(start_time, end_time);

	for ( i = 0; i < data_summary.length; i++){
		current_time = 	string2time(data_summary[i].time);		
		index = (current_time - start_time)/86400000;
		var data_scanned = str2num( string2data( data_summary[i].data_scanned))/1000;
		data_set[index][1] += data_scanned;
	}

	var options = {
	    series: {
		lines: {
		    show: true,
		    lineWidth: 1.2,
		    fill: true
		}
	    },
	    xaxis: {
		mode: "time",
		tickSize: [1, "day"],
		tickFormatter: function (v, axis) {
		    var date = new Date(v);

		    if (date.getSeconds() % 10 == 0) {
		        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
		        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
		        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
			var days = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
			var months = date.getMonth()+1 < 10 ? "0" + date.getMonth()+1 : date.getMonth()+1;
			var years = date.getFullYear();
		        return days + "/" + months;
		    } else {
		        return "";
		    }
		},
		axisLabel: "Time",
		axisLabelUseCanvas: true,
		axisLabelFontSizePixels: 18,
		axisLabelFontFamily: 'Verdana, Arial',
		axisLabelPadding: 10
	    },
	    yaxis: {
		min: 0,
		max: 50,        
		tickSize: 10,
		tickFormatter: function (v, axis) {
		    if (v % 10 == 0) {
		        return v;
		    } else {
		        return "";
		    }
		},
		axisLabel: "GB",
		axisLabelUseCanvas: true,
		axisLabelFontSizePixels: 18,
		axisLabelFontFamily: 'Verdana, Arial',
		axisLabelPadding: 6
	    },
	    legend: {        
		labelBoxBorderColor: "#fff"
	    },
	    grid: {      
		hoverable: true,
		backgroundColor: {colors: ["#fff", "#e4f4f4"]},
		tickColor: "#008040",
			markings: function(axes) {
				var markings = [];
				var xaxis = axes.xaxis;
				for (var x = Math.floor(xaxis.min); x < xaxis.max; x += xaxis.tickSize * 2) {
					markings.push({
						xaxis: {
							from: x,
							to: x + xaxis.tickSize
						},
						color: "rgba(232, 232, 255, 0.2)"
					});
				}
				return markings;
			}		
	    }

	};
	var data = [];
	data.push({
		label:"Data",
		data: data_set,
		color: "#FF0000",
		points: { fillColor: "#FF0000", show: true, radius: 2 } 
	});
	$.plot($('#virus-plot'),data,options);


	var value_section = "";
	value_section += "<table id='data_statistics_table' class='table table-bordered table-hover'>";
	value_section += "<thead> <tr>";
	value_section += "<th> STT </th>";
	value_section += "<th> Time </th>";
	value_section += "<th> Data Scanned( GB ) </th>";
	value_section += "</tr> </thead>";

	value_section += "<tbody>";	
	for(i = 0; i < data_set.length; i++) {
		var d = new Date(data_set[i][0]);
		value_section += "<tr>";
		value_section += "<td>" + (i+1) + "</td>";
		value_section += "<td>" + d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear() + "</td>";
		//value_section += "<td>" + plot_data[i][0] +"</td>";
		value_section += "<td>" + Math.round(data_set[i][1]*1000)/1000 + "</td>";
		value_section += "</tr>";
	}
	value_section += "</tbody>";
	value_section += "</table>";
	$('#value-section').html(value_section);
	$(document).ready(function() {$('#data_statistics_table').dataTable();});
}



socket.on('initial notes',function(data_scan_summary) {
	data_summary = data_scan_summary;
});
socket.on('view sumary detail',function(data_scan_summary_detail) { 
	data_summary_detail = data_scan_summary_detail;
});
