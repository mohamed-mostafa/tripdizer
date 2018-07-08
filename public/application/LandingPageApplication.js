/**
 * 
 */
var tripdizerApplication = angular.module("LandingPageApplication", [])
	.run(
		function ($rootScope) {
			//			$rootScope.serverURL = 'http://localhost:8080'; // local backend server
			$rootScope.serverURL = 'https://tripdizer-backend-dot-feisty-parity-188109.appspot.com'; // remote test backend server
		}
	)
	.config(['$locationProvider', function ($locationProvider) {
		$locationProvider.html5Mode(false);
	}])
	.factory('VideosService', ['$rootScope', '$http', function VideosService($rootScope, $http) {
		var prefix = $rootScope.serverURL + '/public/';

		return {
			getAll: getAll
		}

		function getAll(lang) {
			return $http.get(prefix + 'videos' + (lang ? '?lang=' + lang : ''), {}).then(function (response) {
				return response.data
			})
		}
	}])
	.factory('GroupTripsService', ['$rootScope', '$http', function GroupTripsService($rootScope, $http) {
		var prefix = $rootScope.serverURL + '/';

		return {
			getAll: getAll
		}

		function getAll(lang) {
			return $http.get(prefix + 'groupTrips/current' + (lang ? '?lang=' + lang : ''), {}).then(function (response) {
				return response.data
			})
		}
	}]);