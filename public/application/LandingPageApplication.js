/**
 * 
 */
var tripdizerApplication = angular.module("LandingPageApplication", [])
.run(
		function($rootScope) {
//			$rootScope.serverURL = 'http://localhost:8080'; // local backend server
			$rootScope.serverURL = 'https://tripdizer-backend-dot-feisty-parity-188109.appspot.com'; // remote test backend server
		}
)
.config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode(false);    
}]);

