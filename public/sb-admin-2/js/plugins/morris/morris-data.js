$(function() {
var newdata = new Array();
newdata = [{
	x: '1',
    y: 11
	}, {
	x: '2',
    y: 22	
	}, {
	x: '3',
    y: 33	
	}];	
var realtimechart =  Morris.Line({
        element: 'area-chart-test1',
        data: newdata,
        xkey: 'x',
        ykeys: ['y'],
        ymax: 500,
        labels: ['y'],
        pointSize: 2,
        hideHover: 'auto',
        resize: true
    });
var reLoad = 0;
function data(offset) {
	var result = [];
	var i;
	var index;
	if(offset <= 5){
		index = 0;
	} else {
		index = offset - 5;
	}
	for(i = index; i < offset; i++) {
		result.push({
			x: i,
			y: i*5
		});
	}	
	return result;
}
function update() {
	reLoad++;
	realtimechart.setData(data(reLoad));
}
//alert("Nice to meet you!!!");	
setInterval(function () {update()}, 1000);


var myVar=setInterval(function () {myTimer()}, 1000);
function myTimer() {
    var d = new Date();
    document.getElementById("demo1").innerHTML = d.toLocaleTimeString();
}
});


