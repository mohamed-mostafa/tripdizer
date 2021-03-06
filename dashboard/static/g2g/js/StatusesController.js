/**
 * 
 */

g2gControlCenterApplication.controller("StatusesController", ['$rootScope', '$scope', '$http', 'StatusesService', function ($rootScope, $scope, $http, StatusesService) {
	// fields
	$scope.statuses = [];
	$scope.colors = [
		'aqua',
		'aqua-active',
		'aqua-gradient',
		'black',
		'black-active',
		'blue',
		'blue-active',
		'blue-gradient',
		'danger',
		'fuchsia',
		'fuchsia-active',
		'gray',
		'gray-active',
		'green',
		'green-active',
		'green-gradient',
		'info',
		'light-blue',
		'light-blue-active',
		'light-blue-gradient',
		'lime',
		'lime-active',
		'maroon',
		'maroon-active',
		'maroon-gradient',
		'navy',
		'navy-active',
		'olive',
		'olive-active',
		'orange',
		'orange-active',
		'primary',
		'purple',
		'purple-active',
		'purple-gradient',
		'red',
		'red-active',
		'red-gradient',
		'success',
		'teal',
		'teal-active',
		'teal-gradient',
		'warning',
		'white',
		'yellow',
		'yellow-active',
		'yellow-gradient'
	];

	// validation flags
	$scope.serverError = false;
	$scope.serverErrorMessage = "";
	// form fields
	$scope.newStatus = {};
	$scope.migratedStatus;
	$scope.editMode = false;

	$scope.loading = false;
	$scope.saving = false;

	$scope.titleMissing = false;
	$scope.colorMissing = false;
	$scope.watermarkMissing = false;
	$scope.orderMissing = false;

	// functions
	$scope.resetValidationFlags = function () {
		$scope.titleMissing = false;
		$scope.colorMissing = false;
		$scope.watermarkMissing = false;
		$scope.orderMissing = false;
		$scope.serverError = false;
		$scope.serverErrorMessage = "";
	};
	$scope.newStatusIsValid = function () {
		$scope.resetValidationFlags();
		if ($scope.newStatus.title == null || $scope.newStatus.title == "") {
			$scope.titleMissing = true;
		}
		if ($scope.newStatus.color == null || $scope.newStatus.color == "") {
			$scope.colorMissing = true;
		}
		if ($scope.newStatus.watermark == null || $scope.newStatus.watermark == "") {
			$scope.watermarkMissing = true;
		}
		if ($scope.newStatus.order == null || $scope.newStatus.order == "") {
			$scope.orderMissing = true;
		}
		return $scope.titleMissing !== true && $scope.colorMissing !== true &&
			$scope.watermarkMissing !== true && $scope.orderMissing !== true
	};
	$scope.addStatus = function (close) {
		if ($scope.newStatusIsValid()) {
			$scope.saving = true;
			$http.post($rootScope.serverURL + "/status", {
				status: $scope.newStatus
			}).success(
				function (response) {
					$scope.saving = false;
					$scope.statuses.push(response);
					$scope.statuses.sort((a, b) => a.order - b.order);
					if (close) {
						$('#addStatusModal').modal('hide');
					}
					$scope.newStatus = {};
				}
			).error(function (err) {
				$scope.saving = false;
				$scope.serverError = true;
				$scope.serverErrorMessage = "An error occured at the server side: " + err;
			});
		}
	};
	$scope.editStatus = function (id) {
		$scope.resetValidationFlags();
		if ($scope.newStatusIsValid()) {
			$scope.saving = true;
			$http.put($rootScope.serverURL + "/status", {
				status: $scope.newStatus
			}).success(
				function (response) {
					for (var i = 0; i < $scope.statuses.length; i++) {
						if ($scope.statuses[i].id == response.id) {
							$scope.statuses[i] = response;
							break;
						}
					}
					$scope.statuses.sort((a, b) => a.order - b.order);
					$scope.saving = false;
					$scope.editMode = false;
					$('#addStatusModal').modal('hide');
					$scope.newStatus = {};
					$scope.serverError = false;
				}
			).error(function (err) {
				$scope.serverError = true;
				$scope.serverErrorMessage = "An error occured at the server side: " + err;
			});
		}
	};
	$scope.deleteStatus = function () {
		const id = $scope.newStatus.id;
		$scope.saving = true;
		$http.delete($rootScope.serverURL + "/status/" + id + "?migrateTo=" + $scope.migratedStatus).success(function (response) {
			if (response && response.success) {
				$scope.statuses.splice($scope.statuses.findIndex(s => s.id == response.id), 1);
				$scope.saving = false;
				$('#deleteStatusModal').modal('hide');
				$scope.newStatus = {};
				$scope.serverError = false;
			} else {
				$scope.serverError = true;
				$scope.serverErrorMessage = "An error occured at the server side";
			}
		}).error(function (err) {
			$scope.serverError = true;
			$scope.serverErrorMessage = "An error occured at the server side: " + err;
		});
	};
	$scope.openAddDialog = function (id) {
		$scope.newStatus = {};
		$scope.editMode = false;
		$('#addStatusModal').modal('show');
	};
	$scope.openEditDialog = function (id) {
		$scope.newStatus = $scope.statuses.find(s => s.id === id);
		$scope.editMode = true;
		$('#addStatusModal').modal('show');
	};
	$scope.openDeleteDialog = function (id) {
		$scope.newStatus = $scope.statuses.find(s => s.id === id);
		$('#deleteStatusModal').modal('show');
	};
	$scope.quickEditStatus = function (id) {
		$scope.newStatus = $scope.statuses.find(s => s.id === id);
		$scope.editStatus($scope.newStatus.id);
	};
	$scope.buildTable = function () {
		// initialize the table
		$(function () {
			$('#statusesTable').dataTable({
				"bPaginate": true,
				"bLengthChange": false,
				"bFilter": false,
				"bSort": true,
				"bInfo": true,
				"bAutoWidth": false
			});
		});
	};
	$scope.initialize = function () {
		StatusesService.getAll().then(function (statuses) {
			$scope.statuses = statuses;
		});
	};

	$scope.initialize();
}]);