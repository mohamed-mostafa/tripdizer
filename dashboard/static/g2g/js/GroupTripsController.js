/**
 * 
 */

g2gControlCenterApplication.controller("GroupTripsController", ['$rootScope', '$scope', '$http', 'GroupTripsService', 'ItinerariesService', function ($rootScope, $scope, $http, GroupTripsService, ItinerariesService) {
	// fields
	$scope.groupTrips = [];
	$scope.itineraries = [];

	// validation flags
	$scope.serverError = false;
	$scope.serverErrorMessage = "";
	// form fields
	$scope.newGroupTrip = {};
	$scope.itineraryMissing = false;
	$scope.departureDateMissing = false;
	$scope.returnDateMissing = false;
	$scope.numOfPersonsMissing = false;
	$scope.totalCostMissing = false;
	$scope.imageMissing = false;
	$scope.editMode = false;

	$scope.loading = false;
	$scope.saving = false;

	// functions
	$scope.resetValidationFlags = function () {
		$scope.itineraryMissing = false;
		$scope.departureDateMissing = false;
		$scope.returnDateMissing = false;
		$scope.numOfPersonsMissing = false;
		$scope.totalCostMissing = false;
		$scope.imageMissing = false;
		$scope.serverError = false;
		$scope.serverErrorMessage = "";
	};
	$scope.newGroupTripIsValid = function () {
		$scope.resetValidationFlags();
		if ($scope.newGroupTrip.iternaryId == null || $scope.newGroupTrip.iternaryId == "") {
			$scope.itineraryMissing = true;
		}
		if ($scope.newGroupTrip.departureDate == null || $scope.newGroupTrip.departureDate == "") {
			$scope.departureDateMissing = true;
		}
		if ($scope.newGroupTrip.returnDate == null || $scope.newGroupTrip.returnDate == "") {
			$scope.returnDateMissing = true;
		}
		if ($scope.newGroupTrip.numOfPersons == null || $scope.newGroupTrip.numOfPersons == "") {
			$scope.numOfPersonsMissing = true;
		}
		if ($scope.newGroupTrip.totalCost == null || $scope.newGroupTrip.totalCost == "") {
			$scope.totalCostMissing = true;
		}
		if ($scope.newGroupTrip.image == null || $scope.newGroupTrip.image == "" || !isUrl($scope.newGroupTrip.image)) {
			$scope.imageMissing = true;
		}
		return $scope.itineraryMissing !== true && $scope.imageMissing !== true &&
			$scope.departureDateMissing !== true && $scope.returnDateMissing !== true &&
			$scope.numOfPersonsMissing !== true && $scope.totalCostMissing !== true
	};
	$scope.add = function (close) {
		if ($scope.newGroupTripIsValid()) {
			$scope.saving = true;
			$http.post($rootScope.serverURL + "/groupTrips", $scope.newGroupTrip).success(
				function (response) {
					$scope.saving = false;
					$scope.groupTrips.unshift(response);
					if (close) {
						$('#addModal').modal('hide');
					}
					$scope.newGroupTrip = {};
				}
			).error(function (err) {
				$scope.saving = false;
				$scope.serverError = true;
				$scope.serverErrorMessage = "An error occured at the server side: " + err;
			});
		}
	};
	$scope.edit = function (id) {
		$scope.resetValidationFlags();
		if ($scope.newGroupTripIsValid()) {
			$scope.saving = true;
			$http.put($rootScope.serverURL + "/groupTrips", $scope.newGroupTrip).success(
				function (response) {
					for (var i = 0; i < $scope.groupTrips.length; i++) {
						if ($scope.groupTrips[i].id == response.id) {
							$scope.groupTrips[i] = response;
							break;
						}
					}
					$scope.saving = false;
					$scope.editMode = false;
					$('#addModal').modal('hide');
					$scope.newGroupTrip = {};
					$scope.serverError = false;
				}
			).error(function (err) {
				$scope.serverError = true;
				$scope.serverErrorMessage = "An error occured at the server side: " + err;
			});
		}
	};
	$scope.openAddDialog = function () {
		$scope.newGroupTrip = {};
		$scope.editMode = false;
		$('#addModal').modal('show');
	};
	$scope.openEditDialog = function (id) {
		$scope.newGroupTrip = $scope.groupTrips.find(v => v.id === id);
		$scope.editMode = true;
		$('#addModal').modal('show');
	};
	$scope.toggle = function (groupTripId, type) {
		$scope.saving = true;
		$http.put($rootScope.serverURL + "/groupTrips/toggle", {
			tripId: groupTripId,
			type: type
		}).success(
			function (response) {
				if (!response.success) {
					for (let i = 0; i < $scope.groupTrips.length; i++) {
						if ($scope.groupTrips[i].id === groupTripId) {
							$scope.groupTrips[i][type] = !$scope.groupTrips[i][type];
						}
					}
				}
				$scope.saving = false;
			}
		).error(function (err) {
			$scope.saving = false;
			$scope.serverError = true;
			$scope.serverErrorMessage = "An error occured at the server side: " + err;
		});
	}
	$scope.buildTable = function () {
		// initialize the table
		$(function () {
			$('#groupTripsTable').dataTable({
				"bPaginate": true,
				"bLengthChange": false,
				"bFilter": false,
				"bSort": true,
				"bInfo": true,
				"bAutoWidth": false
			});
		});
	};

	function isUrl(str) {
		regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
		if (regexp.test(str)) return true;
		else return false;
	}
	$scope.initialize = function () {
		GroupTripsService.getAll().then(function (groupTrips) {
			$scope.groupTrips = groupTrips
				.sort((a, b) => b.id - a.id)
				.sort((a, b) => new Date(b.returnDate) - new Date(a.returnDate))
				.sort((a, b) => a.isEnded - b.isEnded)
				.sort((a, b) => b.isNew - a.isNew);
		});
		ItinerariesService.getAll().then(function (itineraries) {
			$scope.itineraries = itineraries;
		});
	};

	$scope.initialize();
}]);