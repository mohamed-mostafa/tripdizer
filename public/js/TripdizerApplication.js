/**
 * 
 */
var tripdizerApplication = angular.module("TripdizerApplication", [])
.run(
		function($rootScope) {
//			$rootScope.serverURL = 'http://localhost:8080'; // local backend server
			$rootScope.serverURL = 'http://services-hezahawsafer.rhcloud.com'; // remote test backend server
//			$rootScope.serverURL = 'http://services.g2gapp.net'; // remote live backend server
//			$rootScope.serverURL = 'http://services.g2gapp.net'; // remote test backend server
		}
)
.config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode(false);    
}]);

