'use strict';



// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/dashboard', {
      templateUrl: 'partials/dashboard',
      controller: 'dashboardCtrl'
    }).
    when('/blank',{
      templateUrl: 'partials/blank',
      controller: 'blankCtrl'
    }).
    when('/tables',{
      templateUrl: 'partials/tables',
      controller: 'tablesCtrl'
    }).
    when('/morris',{
      templateUrl: 'partials/morris',
      controller: 'morrisCtrl'
    }).
    when('/flot',{
      templateUrl: 'partials/flot',
      controller: 'flotCtrl'
    }).
    when('/forms',{
      templateUrl: 'partials/forms',
      controller: 'formsCtrl'
    }).
    when('/panels-wells',{
      templateUrl: 'partials/panels-wells',
      controller: 'panels-wellsCtrl'
    }).
    when('/buttons',{
      templateUrl: 'partials/buttons',
      controller: 'buttonsCtrl'
    }).
    when('/grid',{
      templateUrl: 'partials/grid',
      controller: 'gridCtrl'
    }).
    when('/typography',{
      templateUrl: 'partials/typography',
      controller: 'typographyCtrl'
    }).
    when('/notifications',{
      templateUrl: 'partials/notifications',
      controller: 'notificationsCtrl'
    }).
    when('/admin',{
      templateUrl: 'tmip/admin',
      controller: 'adminCtrl'
    }).
    when('/scansummary',{
      templateUrl: 'partials/scansummary',
      controller: 'scansumaryCtrl'
    }).
    when('/realtime',{
      templateUrl: 'partials/realtime',
      controller: 'realtimeCtrl'
    }).
    when('/statistics',{
      templateUrl: 'partials/statistics',
      controller: 'statisticsCtrl'
    }).
    when('/update',{
      templateUrl: 'partials/update',
      controller: 'updateCtrl'
    }).
    when('/schedule',{
      templateUrl: 'partials/schedule',
      controller: 'scheduleCtrl'
    }).

//added event page
    when('/events',{
      templateUrl: 'partials/events',
      controller: 'eventCtrl'
    }).

//added notification page
    when('/notifications',{
      templateUrl: 'partials/notifications',
      controller: 'notificationCtrl'
    }).

//added history page
    when('/history',{
      templateUrl: 'partials/history',
      controller: 'historyCtrl'
    }).

//added contact us page
    when('/contactus',{
      templateUrl: 'partials/contactus',
      controller: 'contactusCtrl'
    }).

//added test form page
    when('/testform',{
      templateUrl: 'partials/testform',
      controller: 'testformCtrl'
    }).

    when('/manga/test',{
      templateUrl: 'manga/list/1',
      controller: 'adminCtrl'
    }).
    otherwise({
      redirectTo: '/dashboard'
    });

  $locationProvider.html5Mode(true);
});
