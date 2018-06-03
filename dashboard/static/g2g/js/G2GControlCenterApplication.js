/**
 * 
 */
var g2gControlCenterApplication = angular.module("G2GControlCenterApplication", ['textAngular'])
	.run(function ($rootScope) {
		// $rootScope.serverURL = 'http://localhost:8080'; // local backend server
		$rootScope.serverURL = 'https://tripdizer-backend-dot-feisty-parity-188109.appspot.com'; // remote test backend server
	})
	.config(['$locationProvider', function ($locationProvider) {
		$locationProvider.html5Mode(false);
		//    $locationProvider.html5Mode(true);
	}])
	.config(['$httpProvider', '$windowProvider', function ($httpProvider, $windowProvider) {
		var $window = $windowProvider.$get();
		$httpProvider.interceptors.push(function () {
			return {
				request: function (config) {
					config.headers = config.headers || {};
					const JWToken = $window.localStorage.getItem('token');
					if (JWToken) {
						config.headers['Authorization'] = JWToken;
					}
					return config;
				},
				responseError: function (response) {
					if (response.status === 401) { // Unauthorized
						$window.location.href = '/admin/login';
					}
				}
			};
		});
	}])
	.factory('CountriesService', ['$rootScope', '$http', function CountriesService($rootScope, $http) {
		var prefix = $rootScope.serverURL + '/';

		return {
			getAll: getAll
		}

		function getAll() {
			return $http.get(prefix + 'countries').then(function (response) {
				return response.data
			})
		}
	}])
	.factory('PurposesService', ['$rootScope', '$http', function PurposesService($rootScope, $http) {
		var prefix = $rootScope.serverURL + '/';

		return {
			getAll: getAll
		}

		function getAll() {
			return $http.get(prefix + 'purposes').then(function (response) {
				return response.data
			})
		}
	}])
	.factory('BudgetCategoriesService', ['$rootScope', '$http', function BudgetCategoriesService($rootScope, $http) {
		var prefix = $rootScope.serverURL + '/';

		return {
			getAll: getAll
		}

		function getAll() {
			return $http.get(prefix + 'budgetcategories').then(function (response) {
				return response.data
			})
		}
	}])
	.factory('InterestsService', ['$rootScope', '$http', function InterestsService($rootScope, $http) {
		var prefix = $rootScope.serverURL + '/';

		return {
			getAll: getAll
		}

		function getAll() {
			return $http.get(prefix + 'interests').then(function (response) {
				return response.data
			})
		}
	}])
	.factory('ItinerariesService', ['$rootScope', '$http', function ItinerariesService($rootScope, $http) {
		var prefix = $rootScope.serverURL + '/';

		return {
			getAll: getAll
		}

		function getAll() {
			return $http.get(prefix + 'itineraries').then(function (response) {
				return response.data
			})
		}
	}])
	.factory('VideosService', ['$rootScope', '$http', function VideosService($rootScope, $http) {
		var prefix = $rootScope.serverURL + '/public/';

		return {
			getAll: getAll
		}

		function getAll(lang) {
			return $http.get(prefix + 'videos' + (lang ? '?lang=' + lang : '') + lang, {}).then(function (response) {
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
			return $http.get(prefix + 'groupTrips' + (lang ? '?lang=' + lang : ''), {}).then(function (response) {
				return response.data
			})
		}
	}]);