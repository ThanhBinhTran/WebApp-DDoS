

var socket = io();
var select_option = '<fieldset>	<legend style="font-size: 15px" >Network Interface</legend>'; 
select_option += '<table style="width:50%"><tr> <td>NF0: </td>';
select_option += '<td><input type="checkbox" value="cb_NF0_RX" id="cb_NF0_RX" checked="checked" > RX </td>';
select_option += '<td><input type="checkbox" value="cb_NF0_TX" id="cb_NF0_TX"  > TX </td>';
select_option += '<td><input type="checkbox" value="cb_NF0_DROP" id="cb_NF0_DROP"  > RX drop </td>';

select_option += '<td>NF1: </td>';
select_option += '<td><input type="checkbox" value="cb_NF1_RX" id="cb_NF1_RX" > RX </td>';
select_option += '<td><input type="checkbox" value="cb_NF1_TX" id="cb_NF1_TX" > TX </td>';
select_option += '<td><input type="checkbox" value="cb_NF1_DROP" id="cb_NF1_DROP"  > RX drop</td></tr>';

select_option += '<tr><td>NF2: </td>';
select_option += '<td><input type="checkbox" value="cb_NF2_RX" id="cb_NF2_RX" > RX </td>';
select_option += '<td><input type="checkbox" value="cb_NF2_TX" id="cb_NF2_TX" > TX </td>';
select_option += '<td><input type="checkbox" value="cb_NF2_DROP" id="cb_NF2_DROP"  > RX drop </td>';

select_option += '<td>NF3: </td>';
select_option += '<td><input type="checkbox" value="cb_NF3_RX" id="cb_NF3_RX" > RX </td>';
select_option += '<td><input type="checkbox" value="cb_NF3_TX" id="cb_NF3_TX" > TX </td>';
select_option += '<td><input type="checkbox" value="cb_NF3_DROP" id="cb_NF3_DROP"  > RX drop </td></tr>';
select_option += '</table></fieldset><br>';
$('#select-options').html(select_option);

var value_section = '<fieldset>	<legend style="font-size: 15px" >Network history</legend>';
value_section += '<table border="1" style="width:50%; border: 1px solid black">';
value_section += '<tr> <th> Interface </th> <th> RX Speed </th> <th> TX Speed </th> <th> RX DROP Speed </th></tr>';
value_section += '<tr> <td>NF0</td>  <td id="NF0_RX_Speed"> </td>  <td id="NF0_TX_Speed"> </td> <td id="NF0_RX_DROP_Speed"> </td></tr>';
value_section += '<tr> <td>NF1</td>  <td id="NF1_RX_Speed"> </td>  <td id="NF1_TX_Speed"> </td> <td id="NF1_RX_DROP_Speed"> </td></tr>';
value_section += '<tr> <td>NF2</td>  <td id="NF2_RX_Speed"> </td>  <td id="NF2_TX_Speed"> </td> <td id="NF2_RX_DROP_Speed"> </td></tr>';
value_section += '<tr> <td>NF3</td>  <td id="NF3_RX_Speed"> </td>  <td id="NF3_TX_Speed"> </td> <td id="NF3_RX_DROP_Speed"> </td></tr>';	
value_section += '</table></fieldset><br>';

$('#value-section').html(value_section);

// date time picker
//var date_time_picker = '<input id="datetimepicker" type="text" value="" >';
//$('#date-time-picker').html(date_time_picker);
//$("#datetimepicker").datetimepicker();

var time_line  = '<form oninput="x.value=parseInt(display_time.value)">';
    time_line += '<input type="range" id="display_time"  min="30" max="180" step="10" value="40">';
    time_line += '<br><h3 style="text-align: center"><output name="x" id="time_rangeID" value="40"></output></h3></form>';
$('#time-line').html(time_line);
$('input[type="range"]').rangeslider({

    // Feature detection the default is `true`.
    // Set this to `false` if you want to use
    // the polyfill also in Browsers which support
    // the native <input type="range"> element.
    polyfill: false
});


$(function() {
    var container = $("#moving-chart");

    // Determine how many data points to keep based on the placeholder's initial size;
    // this gives us a nice high-res plot while avoiding more than one point per pixel.

    //var maximum = container.outerWidth() / 2 || 300;
    var maximum = container.outerWidth() ;
    //
    //if ( maximum > 120) {
     //   maximum = 30;
    //}
    var minimum_data = 30;
    var maximum_data = 180;


    var NF0_TX_data = [];   
    var NF1_TX_data = [];   
    var NF2_TX_data = [];   
    var NF3_TX_data = [];   

    var NF0_RX_data = [];   
    var NF1_RX_data = [];   
    var NF2_RX_data = [];   
    var NF3_RX_data = [];   

    var NF0_RX_DROP_data = [];   
    var NF1_RX_DROP_data = [];   
    var NF2_RX_DROP_data = [];   
    var NF3_RX_DROP_data = [];

    var timeInterval_FPGA = 1000;		
    var timeInterval_Tx = 1000;	
    var maximum_Tx = parseInt(document.getElementById("display_time").value); 

    function initArray(array) {
       var temp;
       temp = new Date().getTime() - timeInterval_Tx*maximum_Tx;
       while(array.length < maximum_Tx) {
            temp += timeInterval_Tx;
            var tmp = [temp, 0];
            array.push(tmp);
        }	
    }

    function pushData(array, time, data) {
        var data_entries = parseInt(document.getElementById("display_time").value); 
        
        if(array.length > data_entries){
            while(array.length > data_entries){
               array.shift();
            }
        }
        if(array.length == data_entries){
            array.shift();
        }
        
        var temp = [time,data];
        array.push(temp);
    }
    initArray(NF0_TX_data);
    initArray(NF1_TX_data);
    initArray(NF2_TX_data);
    initArray(NF3_TX_data);

    initArray(NF0_RX_data);
    initArray(NF1_RX_data);
    initArray(NF2_RX_data);
    initArray(NF3_RX_data);

socket.on('realtime Chart',function(new_data) {

    /* new_data[0]: Offset
     *    new_data[0] == 0  server time
     *    new_data[0] == 1  nf0 tx
     *    new_data[0] == 2  nf1 tx
     *    new_data[0] == 3  nf2 tx
     *    new_data[0] == 4  nf3 tx
     *    new_data[0] == 5  nf0 rx
     *    new_data[0] == 6  nf1 rx
     *    new_data[0] == 7  nf2 rx
     *    new_data[0] == 8  nf3 rx
     * new_data[1]: Time
     * new_data[2]: Data
     * new_data[3]: Options for flot //	
     *
     */

    var data_set  = [];
    var xticksize = 3;
    //console.log("New data: " + new_data[0]);
    if(new_data[0] == 1) {
        pushData(NF0_TX_data, new_data[1],new_data[2]);
    }else if(new_data[0] == 2) {
        pushData(NF1_TX_data, new_data[1],new_data[2]);  
    }else if(new_data[0] == 3) {
        pushData(NF2_TX_data, new_data[1],new_data[2]);
    }else if(new_data[0] == 4) {
        pushData(NF3_TX_data, new_data[1],new_data[2]);
    }else if(new_data[0] == 5) {
        pushData(NF0_RX_data, new_data[1],new_data[2]);
    }else if(new_data[0] == 6) {
        pushData(NF1_RX_data, new_data[1],new_data[2]);
    }else if(new_data[0] == 7) {
        pushData(NF2_RX_data, new_data[1],new_data[2]);
    }else if(new_data[0] == 8) {
        pushData(NF3_RX_data, new_data[1],new_data[2]);
    }

    //NF0 TX
    if($('#cb_NF0_TX').prop('checked')) {
        data_set.push({
            label:"NF0 TX",
            data: NF0_TX_data, 
            color: "#093145", 
        });
        $('#NF0_TX_Speed').html(NF0_TX_data[NF0_TX_data.length-1][1] + ' Gbps' );	
        
    }

    //NF0 RX
    if( $('#cb_NF0_RX').is(':checked')) {
        data_set.push({
            label:"NF0 RX",
            data: NF0_RX_data, 
            color: "#1496bb", 
        });
        $('#NF0_RX_Speed').html(NF0_RX_data[NF0_RX_data.length-1][1] + ' Gbps' );	
    }

    //NF1 TX
    if( $('#cb_NF1_TX').is(':checked')) {
        data_set.push({
            label:"NF1 TX",
            data: NF1_TX_data, 
            color: "#829356", 
        });
        $('#NF1_TX_Speed').html(NF1_TX_data[NF1_TX_data.length-1][1] + ' Gbps' );	
    }

    //NF1 RX
    if( $('#cb_NF1_RX').is(':checked')) {
        data_set.push({
            label:"NF1 RX",
            data: NF1_RX_data, 
            color: "#bca136", 
        });
        $('#NF1_RX_Speed').html(NF1_RX_data[NF1_RX_data.length-1][1] + ' Gbps' );	
    }

    //NF2 TX
    if( $('#cb_NF2_TX').is(':checked')) {
        data_set.push({
            label:"NF2 TX",
            data: NF2_TX_data, 
            color: "#c2571a", 
        });
        $('#NF2_TX_Speed').html(NF2_TX_data[NF2_TX_data.length-1][1] + ' Gbps' );	
    }

    //NF2 RX
    if( $('#cb_NF2_RX').is(':checked')) {
        data_set.push({
            label:"NF2 RX",
            data: NF2_RX_data, 
            color: "#9a2617", 
        });
        $('#NF2_RX_Speed').html(NF2_RX_data[NF2_RX_data.length-1][1] + ' Gbps' );	
    }

    //NF3 TX
    if( $('#cb_NF3_TX').is(':checked')) {
        data_set.push({
            label:"NF3 TX",
            data: NF3_TX_data, 
            color: "#dfa800", 
        });
        $('#NF3_TX_Speed').html(NF3_TX_data[NF3_TX_data.length-1][1] + ' Gbps' );	
    }

    //NF3 RX
    if( $('#cb_NF3_RX').is(':checked')) {
        data_set.push({ 
            label:"NF3 RX", 
            data: NF3_RX_data, 
            color: "#050959", 
        });
        $('#NF3_RX_Speed').html(NF3_RX_data[NF3_RX_data.length-1][1] + ' Gbps' );	
    }
    var data_entries = parseInt(document.getElementById("display_time").value)/15; 
    options.xaxis.tickSize = [data_entries,"second"];
    $.plot($('#moving-chart'),data_set,options);
});


var options = {
    series: {
        lines: {
            show: true,
            lineWidth: 1.2,
            fill: false
        }
    },
    xaxis: {
        mode: "time",
        tickSize: [2, "second"],
        timeformat: "%M:%S",
        axisLabel: "Time",
        axisLabelUseCanvas: true,
        axisLabelFontSizePixels: 18,
        axisLabelFontFamily: 'Verdana, Arial',
        axisLabelPadding: 10
    },
    yaxis: {
        min: 0,
        max: 10,        
        tickSize: 1,
        tickFormatter: function (v, axis) {
            if (v % 1 == 0) {
                return v;
            } else {
                return "";
            }
        },
        axisLabel: "Speed( Gbps )",
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
    },
    tooltip: true,
    tooltipOpts: {
        content: "'%s' of %x.1 is %y.4",
        shifts: {
            x: -60,
            y: 25
        }
    }
};

});




