/**
 * 
 */

g2gControlCenterApplication.controller("UsersPageContentController", ['$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location) {
	// fields
	$scope.users = [];
	
	// validation flags
	$scope.usernameMissing = false;
	$scope.passwordMissing = false;
	$scope.fullNameMissing = false;
	$scope.phoneMissing = false;
	$scope.serverError = false;
	$scope.serverErrorMessage = "";
	// form fields
	$scope.newUser = {active: true};
	$scope.editMode = false;
	
	$scope.loading = false;
	$scope.saving = false;
	$scope.currentId = 0;
	
    // functions
	$scope.resetValidationFlags = function() {
		$scope.usernameMissing = false;
		$scope.passwordMissing = false;
		$scope.fullNameMissing = false;
		$scope.phoneMissing = false;
		$scope.serverError = false;
		$scope.serverErrorMessage = "";
	};
	$scope.newUserIsValid = function() {
		$scope.resetValidationFlags();
		if ($scope.newUser.username == null || $scope.newUser.username == "") {
			$scope.usernameMissing = true;
		}
		if ($scope.newUser.password == null || $scope.newUser.password == "") {
			$scope.passwordMissing = true;
		}
		if ($scope.newUser.fullName == null || $scope.newUser.fullName == "") {
			$scope.fullNameMissing = true;
		}
		if ($scope.newUser.phone == null || $scope.newUser.phone == "") {
			$scope.phoneMissing = true;
		}
		
		return $scope.usernameMissing == false &&
			$scope.passwordMissing == false &&
			$scope.fullNameMissing == false &&
			$scope.phoneMissing == false;
	};
	$scope.loadUsers = function() {
		$scope.loading = true;
		$http.get($rootScope.serverURL + "/users")
		.success(
				function(response) {
					$scope.users = response;
					$scope.loading = false;
				})
		.error(function(err){
			$scope.users = [];
			$scope.loading = false;
		});
	};
	$scope.addUser = function(close) {
		if ($scope.newUserIsValid()) {
			$scope.saving = true;
			$http.put($rootScope.serverURL + "/user", {user: $scope.newUser}
			).success(
					function(response) {
						$scope.saving = false;
						$scope.newUser = {active: true};
						$scope.users.push(response);
						if (close) {
							$('#addUserModal').modal('hide');
						}
					}
			).error(function(err){
				$scope.saving = false;
				$scope.serverError = true;
				$scope.serverErrorMessage = "An error occured at the server side: " + err;
			});
		}
	};
	$scope.editUser = function(id) {
		$scope.resetValidationFlags();
		if ($scope.newUserIsValid()) {
			$scope.saving = true;
			$http.post($rootScope.serverURL + "/user", {user: $scope.newUser}
			).success(
					function(response) {
						for (var i = 0; i < $scope.users.length; i++) {
							if ($scope.users[i].id == $scope.newUser.id) {
								$scope.users[i] = $scope.newUser;
								break;
							}
						}
						$scope.saving = false;
						$scope.editMode = false;
						$scope.newUser = {active: true};
						$('#addUserModal').modal('hide');
					}
			).error(function(err){
				$scope.newUser = {};
				$scope.editMode = false;
				$scope.saving = false;
				$scope.serverError = true;
				$scope.serverErrorMessage = "An error occured at the server side: " + err;
			});
		}
	};
	$scope.toggleActivation = function(id) {
		// find the clicked item
		$scope.currentId = id;
		for (var i = 0; i < $scope.users.length; i++) {
			if ($scope.users[i].id == id) {
				$scope.newUser = $scope.users[i];
				break;
			}
		}
		// toggle its active attribute
		$scope.newUser.active = !$scope.newUser.active;
		// call the edit function
		$scope.editUser(id);
	};
	$scope.openEditDialog = function (id) {
		$scope.editMode = true;
		for (var i = 0; i < $scope.users.length; i++) {
			if ($scope.users[i].id == id) {
				$scope.newUser = $scope.users[i];
			}
		}
		$('#addUserModal').modal('show');
	};
	$scope.openAddDialog = function (id) {
		$scope.editMode = false;
		$('#addUserModal').modal('show');
	};
	$scope.buildTable = function() {
		// initialize the table
	      $(function () {
	        $('#usersTable').dataTable({
	          "bPaginate": true,
	          "bLengthChange": false,
	          "bFilter": false,
	          "bSort": true,
	          "bInfo": true,
	          "bAutoWidth": false
	        });
	      });
	};
	$scope.initialize = function() {
		$scope.loadUsers();
	};
	
	$scope.initialize();
}]);