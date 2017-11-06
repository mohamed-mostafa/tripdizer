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
	}]);