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
					const JWToken = cuurentGlobalToken;
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
	.directive('ngFileModel', ['$parse', function ($parse) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var model = $parse(attrs.ngFileModel);
				var isMultiple = attrs.multiple;
				var modelSetter = model.assign;
				element.bind('change', function () {
					var values = [];
					angular.forEach(element[0].files, function (item) {
						var value = {
							filename: item.name,
							path: URL.createObjectURL(item),
							contentType: item.type,
							_file: item
						};
						values.push(value);
					});
					scope.$apply(function () {
						if (isMultiple) {
							modelSetter(scope, values);
						} else {
							modelSetter(scope, values[0]);
						}
					});
				});
			}
		};
	}])
	.directive('format', function (dateFilter) {
		return {
			require: 'ngModel',
			link: function (scope, elm, attrs, ctrl) {
				var dateFormat = attrs['format'] || 'yyyy-MM-dd';
				ctrl.$formatters.unshift(function (modelValue) {
					return dateFilter(modelValue, dateFormat);
				});
			}
		};
	})
	.directive('prefix', function () {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function (scope, elm, attrs, ctrl) {
				const prefix = attrs['prefix'] || '';
				const ensurePrefix = (value) => {
					if (value && value.indexOf(prefix) !== 0) {
						if (value.indexOf("https://www.youtube.com/watch?v=") === 0) {
							value = value.split("https://www.youtube.com/watch?v=")[1];
						}
						if (prefix.indexOf(value) === 0) {
							value = '';
						}
						ctrl.$setViewValue(prefix + value);
						ctrl.$render();
						return prefix + value;
					} else
						return value;
				}
				ctrl.$formatters.push(ensurePrefix);
				ctrl.$parsers.splice(0, 0, ensurePrefix);
			}
		};
	})
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
			return $http.get(prefix + 'groupTrips' + (lang ? '?lang=' + lang : ''), {}).then(function (response) {
				return response.data
			})
		}
	}]);