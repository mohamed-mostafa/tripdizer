/**
 * 
 */
var g2gControlCenterApplication = angular.module("G2GControlCenterApplication", ['textAngular'])
	.run(function ($rootScope) {
		//$rootScope.serverURL = 'http://localhost:8080'; // local backend server
		$rootScope.serverURL = 'http://services-hezahawsafer.rhcloud.com'; // remote test backend server
		//$rootScope.serverURL = 'http://services.g2gapp.net'; // remote live backend server
		//$rootScope.serverURL = '#G2G_BACKEND_SERVER_URL#'; // remote test backend server
	})
	.config(['$locationProvider', function ($locationProvider) {
		$locationProvider.html5Mode(false);
		//    $locationProvider.html5Mode(true);
	}]);