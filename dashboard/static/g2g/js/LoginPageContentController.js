/**
 * 
 */

g2gControlCenterApplication.controller("LoginPageContentController", ['$rootScope', '$scope', '$http', '$location', '$window', function ($rootScope, $scope, $http, $location, $window) {
	// fields
	$scope.username = "";
	$scope.password = "";
	$scope.error = false;
	$scope.user = {},
		$scope.success = false;
	$scope.errorMsg = "";
	$scope.loading = false;
	$scope.serverError = false;
	$scope.serverErrorMessage = "";
	$scope.indexPageURL = "";

	// functions
	$scope.login = function () {
		$scope.loading = true;
		$http.post($rootScope.serverURL + "/user/login", {
			username: $scope.username,
			password: $scope.password
		}).success(
			function (response) {
				if (response.user && response.user.token) {
					$scope.error = false;
					$scope.success = true;
					$scope.user = response.user;
					$scope.errorMsg = "";
					$scope.loading = false;
					$window.localStorage.setItem('token', response.user.token);

					if ($scope.user.admin == 1) {
						$scope.indexPageURL = "/admin/home";
					} else {
						$scope.indexPageURL = "/admin/non-admin-index";
					}
				} else {
					$scope.error = true;
					$scope.errorMsg = "Login error";
					$scope.loading = false;
				}
			}
		).error(function (err) {
			$scope.error = true;
			$scope.errorMsg = err;
			$scope.loading = false;
		});
	};

}]);