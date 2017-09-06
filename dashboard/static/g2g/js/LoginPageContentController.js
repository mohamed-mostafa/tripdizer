/**
 * 
 */

g2gControlCenterApplication.controller("LoginPageContentController", ['$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location) {
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
	$scope.login = function() {
		$scope.loading = true;
		$http.post($rootScope.serverURL + "/user/login", {username: $scope.username, password: $scope.password}).success(
			function(response) {
				$scope.error = false;
				$scope.success = true;
				$scope.user = response.user;
				$scope.errorMsg = "";
				$scope.loading = false;
				
				if ($scope.user.admin == 1) {
					$scope.indexPageURL = "/admin/index?username=" + $scope.user.username;
				} else {
					$scope.indexPageURL = "/admin/non-admin-index?username=" + $scope.user.username;
				}
			}
		).error(function(err){
			$scope.error = true;
			$scope.errorMsg = err;
			$scope.loading = false;
		});
	};
	
}]);