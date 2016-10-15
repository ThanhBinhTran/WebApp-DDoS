

var socket = io();
var select_option = '<table style="width:50%"><tr> <td>NF0: </td>';
//var select_option = '<table class="table table-striped table-hover"><tr> <td>NF0: </td>';
select_option += '<td><input type="checkbox" value="cb_NF0_RX" id="cb_NF0_RX" checked="checked" > RX </td>';
select_option += '<td><input type="checkbox" value="cb_NF0_TX" id="cb_NF0_TX" checked="checked" > TX </td>';
select_option += '<td><input type="checkbox" value="cb_NF0_DROP" id="cb_NF0_DROP" checked="checked" > Drop </td>';

select_option += '<td>NF1: </td>';
select_option += '<td><input type="checkbox" value="cb_NF1_RX" id="cb_NF1_RX" checked="checked"> RX </td>';
select_option += '<td><input type="checkbox" value="cb_NF1_TX" id="cb_NF1_TX" checked="checked"> TX </td>';
select_option += '<td><input type="checkbox" value="cb_NF1_DROP" id="cb_NF1_DROP" checked="checked"> Drop</td></tr>';

select_option += '<tr><td>NF2: </td>';
select_option += '<td><input type="checkbox" value="cb_NF2_RX" id="cb_NF2_RX" checked="checked"> RX </td>';
select_option += '<td><input type="checkbox" value="cb_NF2_TX" id="cb_NF2_TX" checked="checked"> TX </td>';
select_option += '<td><input type="checkbox" value="cb_NF2_DROP" id="cb_NF2_DROP" checked="checked"> Drop </td>';

select_option += '<td>NF3: </td>';
select_option += '<td><input type="checkbox" value="cb_NF3_RX" id="cb_NF3_RX" checked="checked"> RX </td>';
select_option += '<td><input type="checkbox" value="cb_NF3_TX" id="cb_NF3_TX" checked="checked"> TX </td>';
select_option += '<td><input type="checkbox" value="cb_NF3_DROP" id="cb_NF3_DROP"  checked="checked"> Drop </td></tr>';
select_option += '</table></fieldset><br>';
$('#select-options').html(select_option);

var value_section = '<fieldset>	<legend style="font-size: 15px" ></legend>';
//value_section += '<table border="1" style="width:50%; border: 1px solid black">';
value_section += '<table class="table table-striped table-hover">';
value_section += '<th> Interface </th> <th> RX Speed </th> <th> TX Speed </th> <th> DROP Speed </th>';
value_section += '<tr> <td>NF0</td>  <td id="NF0_RX_Speed"> </td>  <td id="NF0_TX_Speed"> </td> <td id="NF0_DROP_Speed"> </td></tr>';
value_section += '<tr> <td>NF1</td>  <td id="NF1_RX_Speed"> </td>  <td id="NF1_TX_Speed"> </td> <td id="NF1_DROP_Speed"> </td></tr>';
value_section += '<tr> <td>NF2</td>  <td id="NF2_RX_Speed"> </td>  <td id="NF2_TX_Speed"> </td> <td id="NF2_DROP_Speed"> </td></tr>';
value_section += '<tr> <td>NF3</td>  <td id="NF3_RX_Speed"> </td>  <td id="NF3_TX_Speed"> </td> <td id="NF3_DROP_Speed"> </td></tr>';
value_section += '</table></fieldset><br>';

$('#value-section').html(value_section);

// date time picker
var radio_selection = '<label for="comment"> Switch Unit of Mesurement </label>  <div class="btn-group" data-toggle="buttons">';
radio_selection += '<label class="btn btn-success btn-sm active">';
radio_selection += '<input type="radio" name="options" id="speed_gbps" checked> Gigabit per second</label>';
radio_selection += '<label class="btn btn-success btn-sm">';
radio_selection += '<input type="radio" name="options" id="speed_pps" > Packet per second</label></div>';
$('#radio-selection').html(radio_selection);

var time_line  = '<div id="timeSel"></div>'
$('#time-line').html(time_line);
//$('input[type="range"]').rangeslider({

    // Feature detection the default is `true`.
    // Set this to `false` if you want to use
    // the polyfill also in Browsers which support
    // the native <input type="range"> element.
//    polyfill: false
//});

$(function() {
    var container = $("#moving-chart");

    // Determine how many data points to keep based on the placeholder's initial size;
    // this gives us a nice high-res plot while avoiding more than one point per pixel.

    var NF0_TX_Gbps = [];
    var NF1_TX_Gbps = [];
    var NF2_TX_Gbps = [];
    var NF3_TX_Gbps = [];

    var NF0_RX_Gbps = [];
    var NF1_RX_Gbps = [];
    var NF2_RX_Gbps = [];
    var NF3_RX_Gbps = [];

    var NF0_DROP_Gbps = [];
    var NF1_DROP_Gbps = [];
    var NF2_DROP_Gbps = [];
    var NF3_DROP_Gbps = [];

    var NF0_TX_Pps = [];
    var NF1_TX_Pps = [];
    var NF2_TX_Pps = [];
    var NF3_TX_Pps = [];

    var NF0_RX_Pps = [];
    var NF1_RX_Pps = [];
    var NF2_RX_Pps = [];
    var NF3_RX_Pps = [];

    var NF0_DROP_Pps = [];
    var NF1_DROP_Pps = [];
    var NF2_DROP_Pps = [];
    var NF3_DROP_Pps = [];

    var timeInterval_FPGA = 1000;
    var timeInterval = 1000;
    var data_entries = parseInt(document.getElementById("timeSel").value);

    function initArray(array) {
       var temp;
       temp = new Date().getTime() - timeInterval*data_entries;
       while(array.length < data_entries) {
            temp += timeInterval;
            var tmp = [temp, 0];
            array.push(tmp);
        }
    }

    function pushData(array, time, data) {
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

    function pushDataSET(data_set, cb_nf_interface, nf_data, nf_speed, nf_label, nf_color) {
      if($(cb_nf_interface).prop('checked')) {
        if($(speed_gbps).prop('checked')){
          data_set.push({
            label: nf_label,
            data: nf_data,
            color: nf_color,
          });
          $(nf_speed).html(nf_data[nf_data.length-1][1] + ' Gbps' );
        }
        else if($(speed_pps).prop('checked')){
          data_set.push({
            label: nf_label,
            data: nf_data,
            color: nf_color,
          });
          $(nf_speed).html(nf_data[nf_data.length-1][1] + ' Pps' );
        }
      }
      else{
        $(nf_speed).html('---');
      }
    }

    $("#timeSel").freshslider({
      range: false, // true or false
      step: 10,
      text: true,
      min: 30,
      max: 180,
      unit: " seconds", // the unit which slider is considering
      enabled: true, // true or false
      value: 40, // a number if unranged , or 2 elements array contains low and high value if ranged
      onchange:function(value){
          data_entries = value;
      } // callback function when slider caret's changed, onchange(low, high) for ranged, and onchange(value) for unranged
    });

    initArray(NF0_TX_Gbps);
    initArray(NF1_TX_Gbps);
    initArray(NF2_TX_Gbps);
    initArray(NF3_TX_Gbps);

    initArray(NF0_RX_Gbps);
    initArray(NF1_RX_Gbps);
    initArray(NF2_RX_Gbps);
    initArray(NF3_RX_Gbps);

    initArray(NF0_DROP_Gbps);
    initArray(NF1_DROP_Gbps);
    initArray(NF2_DROP_Gbps);
    initArray(NF3_DROP_Gbps);

    initArray(NF0_TX_Pps);
    initArray(NF1_TX_Pps);
    initArray(NF2_TX_Pps);
    initArray(NF3_TX_Pps);

    initArray(NF0_RX_Pps);
    initArray(NF1_RX_Pps);
    initArray(NF2_RX_Pps);
    initArray(NF3_RX_Pps);

    initArray(NF0_DROP_Pps);
    initArray(NF1_DROP_Pps);
    initArray(NF2_DROP_Pps);
    initArray(NF3_DROP_Pps);


socket.on('realtime Chart',function(new_data) {

    /* new_data[0]: Offset

     *    FOR Gbps
     *    new_data[0] == 0  server time
     *    new_data[0] == 1  nf0 tx
     *    new_data[0] == 2  nf1 tx
     *    new_data[0] == 3  nf2 tx
     *    new_data[0] == 4  nf3 tx

     *    new_data[0] == 5  nf0 rx
     *    new_data[0] == 6  nf1 rx
     *    new_data[0] == 7  nf2 rx
     *    new_data[0] == 8  nf3 rx

     *    new_data[0] == 9   nf0 drop
     *    new_data[0] == 10  nf1 drop
     *    new_data[0] == 11  nf2 drop
     *    new_data[0] == 12  nf3 drop

     *    FOR Ppb
     *    new_data[0] == 21  nf0 tx
     *    new_data[0] == 22  nf1 tx
     *    new_data[0] == 23  nf2 tx
     *    new_data[0] == 24  nf3 tx

     *    new_data[0] == 25  nf0 rx
     *    new_data[0] == 26  nf1 rx
     *    new_data[0] == 27  nf2 rx
     *    new_data[0] == 28  nf3 rx

     *    new_data[0] == 29   nf0 drop
     *    new_data[0] == 30  nf1 drop
     *    new_data[0] == 31  nf2 drop
     *    new_data[0] == 32  nf3 drop

     * new_data[1]: Time
     * new_data[2]: Data
     * new_data[3]: Options for flot //
     *
     */

    var data_set  = [];

    //for Gbps
    if     (new_data[0] == 1){ pushData(NF0_TX_Gbps, new_data[1],new_data[2]);}
    else if(new_data[0] == 2){ pushData(NF1_TX_Gbps, new_data[1],new_data[2]);}
    else if(new_data[0] == 3){ pushData(NF2_TX_Gbps, new_data[1],new_data[2]);}
    else if(new_data[0] == 4){ pushData(NF3_TX_Gbps, new_data[1],new_data[2]);}

    else if(new_data[0] == 5){ pushData(NF0_RX_Gbps, new_data[1],new_data[2]);}
    else if(new_data[0] == 6){ pushData(NF1_RX_Gbps, new_data[1],new_data[2]);}
    else if(new_data[0] == 7){ pushData(NF2_RX_Gbps, new_data[1],new_data[2]);}
    else if(new_data[0] == 8){ pushData(NF3_RX_Gbps, new_data[1],new_data[2]);}

    else if(new_data[0] == 9){ pushData(NF0_DROP_Gbps, new_data[1],new_data[2]);}
    else if(new_data[0] == 10){pushData(NF1_DROP_Gbps, new_data[1],new_data[2]);}
    else if(new_data[0] == 11){pushData(NF2_DROP_Gbps, new_data[1],new_data[2]);}
    else if(new_data[0] == 12){pushData(NF3_DROP_Gbps, new_data[1],new_data[2]);}

    //for Pps
    else if(new_data[0] == 21){pushData(NF0_TX_Pps, new_data[1],new_data[2]);}
    else if(new_data[0] == 22){pushData(NF1_TX_Pps, new_data[1],new_data[2]);}
    else if(new_data[0] == 23){pushData(NF2_TX_Pps, new_data[1],new_data[2]);}
    else if(new_data[0] == 24){pushData(NF3_TX_Pps, new_data[1],new_data[2]);}

    else if(new_data[0] == 25){pushData(NF0_RX_Pps, new_data[1],new_data[2]);}
    else if(new_data[0] == 26){pushData(NF1_RX_Pps, new_data[1],new_data[2]);}
    else if(new_data[0] == 27){pushData(NF2_RX_Pps, new_data[1],new_data[2]);}
    else if(new_data[0] == 28){pushData(NF3_RX_Pps, new_data[1],new_data[2]);}
    
    else if(new_data[0] == 29){pushData(NF0_DROP_Pps, new_data[1],new_data[2]);}
    else if(new_data[0] == 30){pushData(NF1_DROP_Pps, new_data[1],new_data[2]);}
    else if(new_data[0] == 31){pushData(NF2_DROP_Pps, new_data[1],new_data[2]);}
    else if(new_data[0] == 32){pushData(NF3_DROP_Pps, new_data[1],new_data[2]);}


    if($(speed_gbps).prop('checked')){
      pushDataSET(data_set, '#cb_NF0_TX', NF0_TX_Gbps, '#NF0_TX_Speed', "NF0 TX", "#093145");
      pushDataSET(data_set, '#cb_NF1_TX', NF1_TX_Gbps, '#NF1_TX_Speed', "NF1 TX", "#1496bb");
      pushDataSET(data_set, '#cb_NF2_TX', NF2_TX_Gbps, '#NF2_TX_Speed', "NF2 TX", "#829356");
      pushDataSET(data_set, '#cb_NF3_TX', NF3_TX_Gbps, '#NF3_TX_Speed', "NF3 TX", "#bca136");

      pushDataSET(data_set, '#cb_NF0_RX', NF0_RX_Gbps, '#NF0_RX_Speed', "NF0 RX", "#c2571a");
      pushDataSET(data_set, '#cb_NF1_RX', NF1_RX_Gbps, '#NF1_RX_Speed', "NF1 RX", "#9a2617");
      pushDataSET(data_set, '#cb_NF2_RX', NF2_RX_Gbps, '#NF2_RX_Speed', "NF2 RX", "#dfa800");
      pushDataSET(data_set, '#cb_NF3_RX', NF3_RX_Gbps, '#NF3_RX_Speed', "NF3 RX", "#050959");

      pushDataSET(data_set, '#cb_NF0_DROP', NF0_DROP_Gbps, '#NF0_DROP_Speed', "NF0 Drop", "#770000");
      pushDataSET(data_set, '#cb_NF1_DROP', NF1_DROP_Gbps, '#NF1_DROP_Speed', "NF1 Drop", "#cf9494");
      pushDataSET(data_set, '#cb_NF2_DROP', NF2_DROP_Gbps, '#NF2_DROP_Speed', "NF2 Drop", "#002c5a");
      pushDataSET(data_set, '#cb_NF3_DROP', NF3_DROP_Gbps, '#NF3_DROP_Speed', "NF3 Drop", "#96caff");
      options.yaxis.axisLabel = "Speed( Gbps )";
    }else if($(speed_pps).prop('checked')){
      pushDataSET(data_set, '#cb_NF0_TX', NF0_TX_Pps, '#NF0_TX_Speed', "NF0 TX", "#093145");
      pushDataSET(data_set, '#cb_NF1_TX', NF1_TX_Pps, '#NF1_TX_Speed', "NF1 TX", "#1496bb");
      pushDataSET(data_set, '#cb_NF2_TX', NF2_TX_Pps, '#NF2_TX_Speed', "NF2 TX", "#829356");
      pushDataSET(data_set, '#cb_NF3_TX', NF3_TX_Pps, '#NF3_TX_Speed', "NF3 TX", "#bca136");

      pushDataSET(data_set, '#cb_NF0_RX', NF0_RX_Pps, '#NF0_RX_Speed', "NF0 RX", "#c2571a");
      pushDataSET(data_set, '#cb_NF1_RX', NF1_RX_Pps, '#NF1_RX_Speed', "NF1 RX", "#9a2617");
      pushDataSET(data_set, '#cb_NF2_RX', NF2_RX_Pps, '#NF2_RX_Speed', "NF2 RX", "#dfa800");
      pushDataSET(data_set, '#cb_NF3_RX', NF3_RX_Pps, '#NF3_RX_Speed', "NF3 RX", "#050959");

      pushDataSET(data_set, '#cb_NF0_DROP', NF0_DROP_Pps, '#NF0_DROP_Speed', "NF0 Drop", "#770000");
      pushDataSET(data_set, '#cb_NF1_DROP', NF1_DROP_Pps, '#NF1_DROP_Speed', "NF1 Drop", "#cf9494");
      pushDataSET(data_set, '#cb_NF2_DROP', NF2_DROP_Pps, '#NF2_DROP_Speed', "NF2 Drop", "#002c5a");
      pushDataSET(data_set, '#cb_NF3_DROP', NF3_DROP_Pps, '#NF3_DROP_Speed', "NF3 Drop", "#96caff");
      options.yaxis.axisLabel = "Speed( Pps )";
    }
    options.xaxis.tickSize = [data_entries/15,"second"];
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
        //max: 10,
        autorange: 'reversed',
        //range: [0, 10]
        //tickSize: 1,
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
        axisLabelPadding: 6,
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
