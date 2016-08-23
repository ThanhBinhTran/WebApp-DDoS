

var socket = io();

// date time picker
var date_time =  '<text style="text-align: center">From </text><input id="start_datetimepicker" type="text" value="" >';
    date_time += 'to  <input id="end_datetimepicker" type="text" value="" >';
    $('#date-time').html(date_time);
    $("#start_datetimepicker").datetimepicker();
    $("#end_datetimepicker").datetimepicker();


//chart area
var  history_chart = '<canvas id="technig" width="500" height="200"></canvas>'
    $('#history-chart').html(history_chart);

var data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "coming traffic in NF0",
            fillColor: "rgba(229,89,52,0.2)",
            strokeColor: "#9BC53D",
            pointColor: "#E55934",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 40, 71, 56, 65, 80]
        },
        {
            label: "acctacked detection in NF0",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "#E55934",
            pointColor: "#02C39A",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [12, 16, 20, 15, 34, 43, 70]
        }
    ]
};

var context = document.getElementById("technig").getContext("2d");

var myNewChart = new Chart(context , {
    type: "line",
    data: data, 
});
