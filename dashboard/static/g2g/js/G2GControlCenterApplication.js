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
	}]);