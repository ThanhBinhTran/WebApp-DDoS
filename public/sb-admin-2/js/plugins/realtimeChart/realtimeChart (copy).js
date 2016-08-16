
var socket = io();
var select_option = '<fieldset>	<legend style="font-size: 15px" >Network Interface</legend>'; 
    select_option += '<table style="width:50%"><tr> <td>NF0: </td>';
    select_option += '<td><input type="checkbox" value="cb_NF0_TX" id="cb_NF0_TX" checked="checked" > TX </td>';
    select_option += '<td><input type="checkbox" value="cb_NF0_RX" id="cb_NF0_RX" checked="checked" > RX </td>';

    select_option += '<td>NF1: </td>';
    select_option += '<td><input type="checkbox" value="cb_NF1_TX" id="cb_NF1_TX" checked="checked" > TX </td>';
    select_option += '<td><input type="checkbox" value="cb_NF1_RX" id="cb_NF1_RX" checked="checked" > RX </td></tr>';

    select_option += '<tr><td>NF2: </td>';
    select_option += '<td><input type="checkbox" value="cb_NF2_TX" id="cb_NF2_TX" checked="checked" > TX </td>';
    select_option += '<td><input type="checkbox" value="cb_NF2_RX" id="cb_NF2_RX" checked="checked" > RX </td>';

    select_option += '<td>NF3: </td>';
    select_option += '<td><input type="checkbox" value="cb_NF3_TX" id="cb_NF3_TX" checked="checked" > TX </td>';
    select_option += '<td><input type="checkbox" value="cb_NF3_RX" id="cb_NF3_RX" checked="checked" > RX </td></tr>';

    select_option += '</table></fieldset><br>';
    $('#select-options').html(select_option);

var value_section = '<fieldset>	<legend style="font-size: 15px" >Network history</legend>';
    value_section += '<table border="1" style="width:50%; border: 1px solid black">';
    value_section += '<tr> <th> Interface </th> <th> TX Speed </th> <th> RX Speed </th></tr>';
    value_section += '<tr> <td>NF0</td>  <td id="NF0_TX_Speed"> </td>  <td id="NF0_RX_Speed"> </td></tr>';
    value_section += '<tr> <td>NF1</td>  <td id="NF1_TX_Speed"> </td>  <td id="NF1_RX_Speed"> </td></tr>';
    value_section += '<tr> <td>NF2</td>  <td id="NF2_TX_Speed"> </td>  <td id="NF2_RX_Speed"> </td></tr>';
    value_section += '<tr> <td>NF3</td>  <td id="NF3_TX_Speed"> </td>  <td id="NF3_RX_Speed"> </td></tr>';	
    value_section += '</table></fieldset><br>';
    
    $('#value-section').html(value_section);

  $(function() {
    var container = $("#moving-chart");

    // Determine how many data points to keep based on the placeholder's initial size;
    // this gives us a nice high-res plot while avoiding more than one point per pixel.

    //var maximum = container.outerWidth() / 2 || 300;
    var maximum = container.outerWidth() / 8 || 100;
    //
    if ( maximum > 120) {
        maximum = 30;
    }

    //alert(maximum);
    var default_data = [];

    var NF0_TX_data = [];   
    var NF1_TX_data = [];   
    var NF2_TX_data = [];   
    var NF3_TX_data = [];   

    var NF0_RX_data = [];   
    var NF1_RX_data = [];   
    var NF2_RX_data = [];   
    var NF3_RX_data = [];   

    var data_set = [];

    var timeInterval_FPGA = 1000;		
    var timeInterval_Tx = 1000;	
    var maximum_Tx = maximum/(timeInterval_Tx/timeInterval_FPGA);

    var time_server;

    // push nf0 tx data
    function pushNF0_TXData(time,data) {
        if(NF0_TX_data.length <= 1) {
            var temp = time - timeInterval_Tx*maximum_Tx;

            while(NF0_TX_data.length < maximum_Tx) {
                var tmp = [temp+= timeInterval_Tx, 0]
                    NF0_TX_data.push(tmp);
            }	
        }
        NF0_TX_data.shift();
        while (NF0_TX_data.length < maximum_Tx) {     
            //var y = Math.random() * 100;
            var temp = [time,data];
            NF0_TX_data.push(temp);
        }	
    }

    // push nf0 rx data
    function pushNF0_RXData(time,data) {
        if(NF0_RX_data.length <= 1) {
            var temp = time - timeInterval_Tx*maximum_Tx;

            while(NF0_RX_data.length < maximum_Tx) {
                var tmp = [temp+= timeInterval_Tx, 0]
                    NF0_RX_data.push(tmp);
            }	
        }
        NF0_RX_data.shift();
        while (NF0_RX_data.length < maximum_Tx) {     
            //var y = Math.random() * 100;
            var temp = [time,data];
            NF0_RX_data.push(temp);
        }	
    }

    // push nf1 tx data
    function pushNF1_TXData(time,data) {
        if(NF1_TX_data.length <= 1) {
            var temp = time - timeInterval_Tx*maximum_Tx;

            while(NF1_TX_data.length < maximum_Tx) {
                var tmp = [temp+= timeInterval_Tx, 0]
                    NF1_TX_data.push(tmp);
            }	
        }
        NF1_TX_data.shift();
        while (NF1_TX_data.length < maximum_Tx) {     
            //var y = Math.random() * 100;
            var temp = [time,data];
            NF1_TX_data.push(temp);
        }	
    }

    // push nf1 rx data
    function pushNF1_RXData(time,data) {
        if(NF1_RX_data.length <= 1) {
            var temp = time - timeInterval_Tx*maximum_Tx;

            while(NF1_RX_data.length < maximum_Tx) {
                var tmp = [temp+= timeInterval_Tx, 0]
                    NF1_RX_data.push(tmp);
            }	
        }
        NF1_RX_data.shift();
        while (NF1_RX_data.length < maximum_Tx) {     
            //var y = Math.random() * 100;
            var temp = [time,data];
            NF1_RX_data.push(temp);
        }	
    }

    // push nf2 tx data
    function pushNF2_TXData(time,data) {
        if(NF2_TX_data.length <= 1) {
            var temp = time - timeInterval_Tx*maximum_Tx;

            while(NF2_TX_data.length < maximum_Tx) {
                var tmp = [temp+= timeInterval_Tx, 0]
                    NF2_TX_data.push(tmp);
            }	
        }
        NF2_TX_data.shift();
        while (NF2_TX_data.length < maximum_Tx) {     
            //var y = Math.random() * 100;
            var temp = [time,data];
            NF2_TX_data.push(temp);
        }	
    }

    // push nf2 rx data
    function pushNF2_RXData(time,data) {
        if(NF2_RX_data.length <= 1) {
            var temp = time - timeInterval_Tx*maximum_Tx;

            while(NF2_RX_data.length < maximum_Tx) {
                var tmp = [temp+= timeInterval_Tx, 0]
                    NF2_RX_data.push(tmp);
            }	
        }
        NF2_RX_data.shift();
        while (NF2_RX_data.length < maximum_Tx) {     
            //var y = Math.random() * 100;
            var temp = [time,data];
            NF2_RX_data.push(temp);
        }	
    }

    // push nf3 tx data
    function pushNF3_TXData(time,data) {
        if(NF3_TX_data.length <= 1) {
            var temp = time - timeInterval_Tx*maximum_Tx;

            while(NF3_TX_data.length < maximum_Tx) {
                var tmp = [temp+= timeInterval_Tx, 0]
                    NF3_TX_data.push(tmp);
            }	
        }
        NF3_TX_data.shift();
        while (NF3_TX_data.length < maximum_Tx) {     
            //var y = Math.random() * 100;
            var temp = [time,data];
            NF3_TX_data.push(temp);
        }	
    }

    // push nf3 rx data
    function pushNF3_RXData(time,data) {
        if(NF3_RX_data.length <= 1) {
            var temp = time - timeInterval_Tx*maximum_Tx;

            while(NF3_RX_data.length < maximum_Tx) {
                var tmp = [temp+= timeInterval_Tx, 0]
                    NF3_RX_data.push(tmp);
            }	
        }
        NF3_RX_data.shift();
        while (NF3_RX_data.length < maximum_Tx) {     
            //var y = Math.random() * 100;
            var temp = [time,data];
            NF3_RX_data.push(temp);
        }	
    }
    /*
       function pushDefaultData(){
       default_data.shift();
       while (default_data.length < maximum) {     
//var y = Math.random() * 100;
var temp = [now, 0];
default_data.push(temp);
}		
}
*/



//var select_div = document.getElementById('select-options');
//select_div.innerHTML = select_option;

//getInitData();
//getInitTxData();
/*
   setInterval(function updateRandom() {
   var y = Math.random() * 100;
   pushData(y);
//alert(data);
data_set = [
{label:"FPGA", data: data,color: "#FF0000" }
];
$.plot($('#moving-chart'),data_set,options);
}, 1000);
*/	
$('#Nuoc').html("Welcome!!!");
socket.on('realtime Chart',function(new_data) {

    /* new_data[0]: Offset
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
    //alert(new_data[1]);
    //time_server = new_data[1];
    data_set = [];

    $('#Nuoc').html(new Date(new_data[1]));

    if(new_data[0] == 1) {
        pushNF0_TXData (new_data[1],new_data[2]);
    }else if(new_data[0] == 2) {
        pushNF1_TXData (new_data[1],new_data[2]);
    }else if(new_data[0] == 3) {
        pushNF2_TXData (new_data[1],new_data[2]);
    }else if(new_data[0] == 4) {
        pushNF3_TXData (new_data[1],new_data[2]);
    }else if(new_data[0] == 5) {
        pushNF0_RXData (new_data[1],new_data[2]);
    }else if(new_data[0] == 6) {
        pushNF1_RXData (new_data[1],new_data[2]);
    }else if(new_data[0] == 7) {
        pushNF2_RXData (new_data[1],new_data[2]);
    }else if(new_data[0] == 8) {
        pushNF3_RXData (new_data[1],new_data[2]);
    }

    //NF0 TX
    if( $('#cb_NF0_TX').is(':checked')) {
        data_set.push({
            label:"NF0 TX",
            data: NF0_TX_data, 
            color: "#00000F", 
        });
        //$('#NF0_TX_Speed').html(NF0_TX_data[maximum_Tx-1][1] + ' Gbps' );	
    }

    //NF0 RX
    if( $('#cb_NF0_RX').is(':checked')) {
        data_set.push({
            label:"NF0 RX",
            data: NF0_RX_data, 
            color: "#0000F0", 
        });
        //$('#NF0_RX_Speed').html(NF0_RX_data[maximum_Tx-1][1] + ' Gbps' );	
    }

    //NF1 TX
    if( $('#cb_NF1_TX').is(':checked')) {
        data_set.push({
            label:"NF1 TX",
            data: NF1_TX_data, 
            color: "#000F00", 
        });
        //$('#NF1_TX_Speed').html(NF1_TX_data[maximum_Tx-1][1] + ' Gbps' );	
    }

    //NF1 RX
    if( $('#cb_NF1_RX').is(':checked')) {
        data_set.push({
            label:"NF1 RX",
            data: NF1_RX_data, 
            color: "#00F000", 
        });
        //$('#NF1_RX_Speed').html(NF1_RX_data[maximum_Tx-1][1] + ' Gbps' );	
    }

    //NF2 TX
    if( $('#cb_NF2_TX').is(':checked')) {
        data_set.push({
            label:"NF2 TX",
            data: NF2_TX_data, 
            color: "#0F0000", 
        });
        //$('#NF2_TX_Speed').html(NF2_TX_data[maximum_Tx-1][1] + ' Gbps' );	
    }

    //NF2 RX
    if( $('#cb_NF2_RX').is(':checked')) {
        data_set.push({
            label:"NF2 RX",
            data: NF2_RX_data, 
            color: "#F00000", 
        });
        //$('#NF2_RX_Speed').html(NF2_RX_data[maximum_Tx-1][1] + ' Gbps' );	
    }

    //NF3 TX
    if( $('#cb_NF3_TX').is(':checked')) {
        data_set.push({
            label:"NF3 TX",
            data: NF3_TX_data, 
            color: "#00FFF0", 
        });
        //$('#NF3_TX_Speed').html(NF3_TX_data[maximum_Tx-1][1] + ' Gbps' );	
    }

    //NF3 RX
    if( $('#cb_NF3_RX').is(':checked')) {
        data_set.push({ 
            label:"NF3 RX", 
            data: NF3_RX_data, 
            color: "#0F00F0", 
        });
        //$('#NF3_RX_Speed').html(NF3_RX_data[maximum_Tx-1][1] + ' Gbps' );	
    }

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
        /*
           tickFormatter: function (v, axis) {

           var date = new Date(time_server);

           if (date.getSeconds() % 10 == 0) {
           var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
           var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
           var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

           return hours + ":" + minutes + ":" + seconds;
           } else {
           return "";
           }

           },
           */
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
