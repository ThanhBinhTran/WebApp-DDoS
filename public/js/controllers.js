'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, $http) {

    $http({
      method: 'GET',
      url: '/api/name'
    }).
    success(function (data, status, headers, config) {
      $scope.name = data.name;
    }).
    error(function (data, status, headers, config) {
      $scope.name = 'Error!';
    });

  }).
  controller('dashboardCtrl', function ($scope) {
    // write Ctrl
    $scope.$on('$viewContentLoaded', function ()
     {
       // javascript code here
       $('div#page-wrapper div:last').nextAll('script').remove();
       $('div#page-wrapper').append('<script src="/socket.io/socket.io.js"></script>'+
									'<script src="sb-admin-2/js/plugins/flot/excanvas.min.js"></script>'+
                                    '<script src="sb-admin-2/js/plugins/flot/jquery.flot.js"></script>'+
									'<script src="sb-admin-2/js/plugins/flot/jquery.flot.time.js"></script>'+
                                    '<script src="sb-admin-2/js/plugins/flot/jquery.flot.axislabels.js"></script>'+
                                    '<script src="sb-admin-2/js/plugins/flot/jquery.flot.symbol.js"></script>'+
                                    '<script src="sb-admin-2/js/plugins/flot/jshashtable-3.0.js"></script>'+
				    '<script src="sb-admin-2/js/plugins/flot/jquery.numberformatter-1.2.3.min.js"></script>'+
                                    '<script src="sb-admin-2/js/plugins/realtimeChart/realtimeChart.js"></script>'+
				    '<script src="sb-admin-2/js/plugins/dashboard/dashboard.js"></script>');
     });
  }).
  controller('flotCtrl', function ($scope) {
    // write Ctrl here
    $scope.$on('$viewContentLoaded', function ()
     {
       $scope.$parent.name = 'Flottttt';
       // javascript code here
       $('div#page-wrapper div:last').nextAll('script').remove();
       $('div#page-wrapper').append('<script src="sb-admin-2/js/plugins/flot/excanvas.min.js"></script>'+
                                    '<script src="sb-admin-2/js/plugins/flot/jquery.flot.js"></script>'+
                                    '<script src="sb-admin-2/js/plugins/flot/jquery.flot.pie.js"></script>'+
                                    '<script src="sb-admin-2/js/plugins/flot/jquery.flot.resize.js"></script>'+
                                    '<script src="sb-admin-2/js/plugins/flot/jquery.flot.tooltip.min.js"></script>'+
                                    '<script src="sb-admin-2/js/plugins/flot/flot-data.js"></script>');
     });
  }).
  controller('morrisCtrl', function($scope){
    $scope.$on('$viewContentLoaded', function ()
     {
      $scope.$parent.name = 'Morris.js Charts';
      // javascript code here
      $('div#page-wrapper div:last').nextAll('script').remove();
      $('div#page-wrapper').append('<script src="sb-admin-2/js/plugins/morris/raphael.min.js"></script>'+
                                      '<script src="sb-admin-2/js/plugins/morris/morris.min.js"></script>'+
                                      '<script src="sb-admin-2/js/plugins/morris/morris-data.js"></script>');
     });
  }).
  controller('tablesCtrl', function($scope){
    $scope.$on('$viewContentLoaded', function ()
     {
      $scope.$parent.name = 'Tables';
      // javascript code here
      $('div#page-wrapper div:last').nextAll('script').remove();
      $('div#page-wrapper').append('<script src="sb-admin-2/js/plugins/dataTables/jquery.dataTables.js"></script>'+
                                      '<script src="sb-admin-2/js/plugins/dataTables/dataTables.bootstrap.js"></script>'+
                                  '<script>$(document).ready(function() {$("#dataTables-example1").dataTable();});</script>');
     });
  }).controller('formsCtrl', function($scope){
    $scope.$on('$viewContentLoaded', function()
     {
      $scope.$parent.name = 'Forms';
      $('div#page-wrapper div:last').nextAll('script').remove();
     });
  }).controller('gridCtrl', function($scope){
    $scope.$on('$viewContentLoaded', function()
     {
      $scope.$parent.name = 'Grid';
      $('div#page-wrapper div:last').nextAll('script').remove();
     });
  }).controller('typographyCtrl', function($scope){
    $scope.$on('$viewContentLoaded', function()
     {
      $scope.$parent.name = 'Typography';
      $('div#page-wrapper div:last').nextAll('script').remove();
     });
  }).controller('buttonsCtrl', function($scope){
    $scope.$on('$viewContentLoaded', function()
     {
      $scope.$parent.name = 'Buttons';
      $('div#page-wrapper div:last').nextAll('script').remove();
     });
  }).controller('notificationsCtrl', function($scope){
    $scope.$on('$viewContentLoaded', function()
     {
      $scope.$parent.name = 'Notifications';
      $('div#page-wrapper div:last').nextAll('script').remove();
     });
  }).controller('panels-wellsCtrl', function($scope){
    $scope.$on('$viewContentLoaded', function()
     {
      $scope.$parent.name = 'Panels and Wells';
      $('div#page-wrapper div:last').nextAll('script').remove();
     });
  }).controller('blankCtrl', function($scope){
    $scope.$on('$viewContentLoaded', function()
     {
      $scope.$parent.name = 'Blank';
      $('div#page-wrapper div:last').nextAll('script').remove();
     });
  }).controller('adminCtrl', function($scope){
    $scope.$on('$viewContentLoaded', function()
     {
      $scope.$parent.name = 'Admin';
      $('div#page-wrapper div:last').nextAll('script').remove();
     });
  }).controller('scansumaryCtrl', function($scope){
    $scope.$on('$viewContentLoaded', function()
     {
      $scope.$parent.name = 'NETWORK HISTORY';
      $('div#page-wrapper div:last').nextAll('script').remove();
	  //$('div#top-of-script').append();
      $('div#page-wrapper').append('<script src="/socket.io/socket.io.js"></script>'
								  +'<script src="js/lib/jquery/jquery-2.1.1.min.js"></script>'
								 // +'<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>'
								 //+'<script src="http://ajax.googleapis.com/ajax/libs/prototype/1.6.1.0/prototype.js" type="text/javascript"> </script>'
								 //+'<script src="http://ajax.googleapis.com/ajax/libs/scriptaculous/1.8.3/scriptaculous.js" type="text/javascript"> </script>'
								  +'<script src="sb-admin-2/js/plugins/dataTables/jquery.dataTables.js"></script>'
                                  +'<script src="sb-admin-2/js/plugins/dataTables/dataTables.bootstrap.js"></script>'
								  //+'<script src="http://cdn.datatables.net/1.10.3/js/jquery.dataTables.min.js"></script>'
								  +'<script src="sb-admin-2/js/plugins/test/test.js" > </script>'
                                  //+'<script>$(document).ready(function() {$("#testTables-example").dataTable();});</script>'
								  );
     });
  }).controller('realtimeCtrl', function($scope){
    $scope.$on('$viewContentLoaded', function()
     {
      $scope.$parent.name = 'Real Time HighChart';
       $('div#page-wrapper div:last').nextAll('script').remove();
       $('div#page-wrapper').append('<script src="/socket.io/socket.io.js"></script>'+
									//'<script src="sb-admin-2/js/plugins/morris/raphael.min.js"></script>'+
                                    //'<script src="sb-admin-2/js/plugins/morris/morris.min.js"></script>'+
                                    //'<script src="sb-admin-2/js/plugins/morris/morris-data.js"></script>'+
									'<script src="sb-admin-2/js/plugins/flot/excanvas.min.js"></script>'+
                                    '<script src="sb-admin-2/js/plugins/flot/jquery.flot.js"></script>'+
									'<script src="sb-admin-2/js/plugins/flot/jquery.flot.time.js"></script>'+
                                    '<script src="sb-admin-2/js/plugins/flot/jquery.flot.axislabels.js"></script>'+
                                    '<script src="sb-admin-2/js/plugins/flot/jquery.flot.symbol.js"></script>'+
                                    '<script src="sb-admin-2/js/plugins/flot/jshashtable-3.0.js"></script>'+
									'<script src="sb-admin-2/js/plugins/flot/jquery.numberformatter-1.2.3.min.js"></script>'+
                                    '<script src="sb-admin-2/js/plugins/realtimeChart/realtimeChart.js"></script>');
     });
  }).controller('statisticsCtrl', function($scope){
    $scope.$on('$viewContentLoaded', function()
     {
      $scope.$parent.name = 'Statistics';
       $('div#page-wrapper div:last').nextAll('script').remove();
       $('div#page-wrapper').append('<script src="/socket.io/socket.io.js"></script>'+
				    '<script src="sb-admin-2/js/plugins/flot/excanvas.min.js"></script>'+
                                    '<script src="sb-admin-2/js/plugins/flot/jquery.flot.js"></script>'+
				    '<script src="sb-admin-2/js/plugins/flot/jquery.flot.time.js"></script>'+
                                    '<script src="sb-admin-2/js/plugins/flot/jquery.flot.axislabels.js"></script>'+
                                    '<script src="sb-admin-2/js/plugins/flot/jquery.flot.symbol.js"></script>'+
                                    '<script src="sb-admin-2/js/plugins/flot/jshashtable-3.0.js"></script>'+
			    	    '<script src="sb-admin-2/js/plugins/flot/jquery.numberformatter-1.2.3.min.js"></script>'+
				   '<script src="sb-admin-2/js/plugins/dataTables/jquery.dataTables.js"></script>'+
                                  '<script src="sb-admin-2/js/plugins/dataTables/dataTables.bootstrap.js"></script>' +
                                    '<script src="sb-admin-2/js/plugins/statistics/statistics.js"></script>');
     });
  }).controller('updateCtrl', function($scope){
    $scope.$on('$viewContentLoaded', function()
     {
      $scope.$parent.name = 'Update';
       $('div#page-wrapper div:last').nextAll('script').remove();
       $('div#page-wrapper').append('<script src="/socket.io/socket.io.js"></script>'+
				    '<script src="sb-admin-2/js/plugins/update/jquery-ui-1.11.2/jquery-ui.css"> </script>'+
				    '<script src="sb-admin-2/js/plugins/update/jquery-ui-1.11.2/external/jquery/jquery.js"> </script>'+
				    '<script src="sb-admin-2/js/plugins/update/jquery-ui-1.11.2/jquery-ui.js"> </script>'+
                                    '<script src="sb-admin-2/js/plugins/update/update.js"></script>');
     });
  }).controller('scheduleCtrl', function($scope){
    $scope.$on('$viewContentLoaded', function()
     {
      $scope.$parent.name = 'Schedule';
       $('div#page-wrapper div:last').nextAll('script').remove();
       $('div#page-wrapper').append('<script src="/socket.io/socket.io.js"></script>'+
                                    '<script src="sb-admin-2/js/plugins/schedule/schedule.js"></script>');
     });
  })
  .controller('historyCtrl', function($scope){
    $scope.$on('$viewContentLoaded', function()
     {
      $scope.$parent.name = 'History';
       $('div#page-wrapper div:last').nextAll('script').remove();
       $('div#page-wrapper').append('<script src="/socket.io/socket.io.js"></script>'+
                                    '<script src="sb-admin-2/js/plugins/history/history.js"></script>');
     });
  })

  .controller('eventCtrl', function($scope){
    $scope.$on('$viewContentLoaded', function()
     {
      $scope.$parent.name = 'Event';
       $('div#page-wrapper div:last').nextAll('script').remove();
       $('div#page-wrapper').append('<script src="/socket.io/socket.io.js"></script>'+
                                    '<script src="sb-admin-2/js/plugins/event/event.js"></script>');
     });
  })

  .controller('notificationCtrl', function($scope){
    $scope.$on('$viewContentLoaded', function()
     {
      $scope.$parent.name = 'Notification';
       $('div#page-wrapper div:last').nextAll('script').remove();
       $('div#page-wrapper').append('<script src="/socket.io/socket.io.js"></script>'+
                                    '<script src="sb-admin-2/js/plugins/notification/notification.js"></script>');
     });
  });

// remember to remove ; before add new controller :D
