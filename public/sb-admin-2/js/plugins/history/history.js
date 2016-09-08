

var socket = io();

var now = new Date();
var curDate_start = now.getFullYear() + "/" + now.getMonth() + "/" + now.getDate() + " 00:00";
var curDate_end = now.getFullYear() + "/" + now.getMonth() + "/" + now.getDate() + " 23:55";

// date time picker
var date_time  = '<form class="form-inline">';
    date_time += '<label for="comment"> From: </label><input type="text" class="form-control" id="start_datetimepicker" value="'+ curDate_start +'" >';
    date_time += '<label for="comment"> to: </label><input type="text" class="form-control" id="end_datetimepicker" value="'+ curDate_end +'" >';
    date_time += '<button type="button" class="btn btn-primary btn-sm" onclick="history_query();"> Search </button> </form>';

    $('#date-time').html(date_time);
    $("#start_datetimepicker").datetimepicker();
    $("#end_datetimepicker").datetimepicker();


//send event
var query_dateStart;
var query_dateEnd;

query_dateStart = document.getElementById("start_datetimepicker").value;
query_dateEnd   = document.getElementById("end_datetimepicker").value;
socket.emit('history', query_dateStart + "to" + query_dateEnd);

//receive data from server
socket.on('history results',function(result_rows){

  var  history_chart  = '<canvas id="nf0_interface" width="500" height="200"></canvas>';
       history_chart += '<canvas id="nf1_interface" width="500" height="200"></canvas>';
       history_chart += '<canvas id="nf2_interface" width="500" height="200"></canvas>';
       history_chart += '<canvas id="nf3_interface" width="500" height="200"></canvas>';
      $('#history-chart').html(history_chart);

  var nf0_data = {
      labels: [],
      datasets: [
          {
              label: "Coming traffic in NF0",
              fillColor: "rgba(229,89,52,0.2)",
              strokeColor: "#9BC53D",
              pointColor: "#E55934",
              pointStrokeColor: "#ff0000",
              pointHighlightFill: "#ff0000",
              pointHighlightStroke: "rgba(220,220,220,1)",
              data: []
          },
          {
              label: "Attacking detection in NF0",
              fillColor: "rgba(151,187,205,0.2)",
              strokeColor: "#E55934",
              pointColor: "#02C39A",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(151,187,205,1)",
              data:[]
          }
      ]
  };

  var nf1_data = {
      labels: [],
      datasets: [
          {
              label: "Coming traffic in NF1",
              fillColor: "rgba(229,89,52,0.2)",
              strokeColor: "#9BC53D",
              pointColor: "#E55934",
              pointStrokeColor: "#ff0000",
              pointHighlightFill: "#ff0000",
              pointHighlightStroke: "rgba(220,220,220,1)",
              data: []
          },
          {
              label: "Attacking detection in NF1",
              fillColor: "rgba(151,187,205,0.2)",
              strokeColor: "#E55934",
              pointColor: "#02C39A",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(151,187,205,1)",
              data:[]
          }
      ]
  };

  var nf2_data = {
      labels: [],
      datasets: [
          {
              label: "Coming traffic in NF2",
              fillColor: "rgba(229,89,52,0.2)",
              strokeColor: "#9BC53D",
              pointColor: "#E55934",
              pointStrokeColor: "#ff0000",
              pointHighlightFill: "#ff0000",
              pointHighlightStroke: "rgba(220,220,220,1)",
              data: []
          },
          {
              label: "Attacking detection in NF2",
              fillColor: "rgba(151,187,205,0.2)",
              strokeColor: "#E55934",
              pointColor: "#02C39A",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(151,187,205,1)",
              data:[]
          }
      ]
  };

  var nf3_data = {
      labels: [],
      datasets: [
          {
              label: "Coming traffic in NF3",
              fillColor: "rgba(229,89,52,0.2)",
              strokeColor: "#9BC53D",
              pointColor: "#E55934",
              pointStrokeColor: "#ff0000",
              pointHighlightFill: "#ff0000",
              pointHighlightStroke: "rgba(220,220,220,1)",
              data: []
          },
          {
              label: "Attacking detection in NF3",
              fillColor: "rgba(151,187,205,0.2)",
              strokeColor: "#E55934",
              pointColor: "#02C39A",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(151,187,205,1)",
              data:[]
          }
      ]
  };

  var context_nf0 = document.getElementById("nf0_interface").getContext("2d");
  var context_nf1 = document.getElementById("nf1_interface").getContext("2d");
  var context_nf2 = document.getElementById("nf2_interface").getContext("2d");
  var context_nf3 = document.getElementById("nf3_interface").getContext("2d");

  for (var i = 0; i < result_rows.length; i++) {
    if(result_rows[i].nf_interface == 0){
      nf0_data.labels.push(result_rows[i].datetime);
      nf0_data.datasets[0].data.push(parseInt(result_rows[i].packet_per_second));
      nf0_data.datasets[1].data.push(parseInt(result_rows[i].packet_drop_per_second));
    }
    else if(result_rows[i].nf_interface == 1){
      nf1_data.labels.push(result_rows[i].datetime);
      nf1_data.datasets[0].data.push(parseInt(result_rows[i].packet_per_second));
      nf1_data.datasets[1].data.push(parseInt(result_rows[i].packet_drop_per_second));
    }
    else if(result_rows[i].nf_interface == 2){
      nf2_data.labels.push(result_rows[i].datetime);
      nf2_data.datasets[0].data.push(parseInt(result_rows[i].packet_per_second));
      nf2_data.datasets[1].data.push(parseInt(result_rows[i].packet_drop_per_second));
    }
    else if(result_rows[i].nf_interface == 3){
      nf3_data.labels.push(result_rows[i].datetime);
      nf3_data.datasets[0].data.push(parseInt(result_rows[i].packet_per_second));
      nf3_data.datasets[1].data.push(parseInt(result_rows[i].packet_drop_per_second));
    }

	};

  var myNewChart = new Chart(context_nf0 , {
      type: 'line',
      data: nf0_data
  });

  var myNewChart = new Chart(context_nf1 , {
      type: 'line',
      data: nf1_data
  });

  var myNewChart = new Chart(context_nf2 , {
      type: 'line',
      data: nf2_data
  });

  var myNewChart = new Chart(context_nf3 , {
      type: 'line',
      data: nf3_data
  });
});

function history_query() {
  query_dateStart = document.getElementById("start_datetimepicker").value;
  query_dateEnd   = document.getElementById("end_datetimepicker").value;
  socket.emit('history', query_dateStart + "to" + query_dateEnd);
}
