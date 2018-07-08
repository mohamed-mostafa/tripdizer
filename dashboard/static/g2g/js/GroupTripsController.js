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
	$scope.mailSubjectMissing = false;
	$scope.mailBodyMissing = false;
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
		$scope.mailSubjectMissing = false;
		$scope.mailBodyMissing = false;
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
		if ($scope.newGroupTrip.mailSubject == null || $scope.newGroupTrip.mailSubject == "") {
			$scope.mailSubjectMissing = true;
		}
		if ($scope.newGroupTrip.mailBody == null || $scope.newGroupTrip.mailBody == "") {
			$scope.mailBodyMissing = true;
		}
		return $scope.itineraryMissing !== true && $scope.imageMissing !== true &&
			$scope.departureDateMissing !== true && $scope.returnDateMissing !== true &&
			$scope.numOfPersonsMissing !== true && $scope.totalCostMissing !== true &&
			$scope.mailSubjectMissing !== true && $scope.mailBodyMissing !== true
	};
	$scope.add = function (close) {
		if ($scope.newGroupTripIsValid()) {
			$scope.saving = true;
			$http({
				method: "POST",
				url: $rootScope.serverURL + "/groupTrips",
				headers: {
					'Content-Type': undefined
				},
				transformRequest: function (data) {
					var fd = new FormData();
					for (var key in data) {
						if (data.hasOwnProperty(key)) {
							if (key === "mailAttachments") {
								for (let i = 0; i < data[key].length; i++) {
									fd.append("file", data[key][i]._file);
								}
							} else {
								fd.append(key, data[key]);
							}
						}
					}
					return fd;
				},
				data: $scope.newGroupTrip
			}).success(
				function (response) {
					$scope.saving = false;
					if (response.departureDate) response.departureDate = new Date(response.departureDate);
					if (response.returnDate) response.returnDate = new Date(response.returnDate);
					$scope.groupTrips.unshift(response);
					if (close) {
						$('#addModal').modal('hide');
					}
					$scope.newGroupTrip = {
						mailBody: generateMailBody(),
						mailAttachments: []
					};
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
			$http({
				method: "PUT",
				url: $rootScope.serverURL + "/groupTrips",
				headers: {
					'Content-Type': undefined
				},
				transformRequest: function (data) {
					var fd = new FormData();
					for (var key in data) {
						if (data.hasOwnProperty(key)) {
							if (key === "mailAttachments") {
								for (let i = 0; i < data[key].length; i++) {
									fd.append("file", data[key][i]._file);
								}
							} else {
								fd.append(key, data[key]);
							}
						}
					}
					return fd;
				},
				data: $scope.newGroupTrip
			}).success(
				function (response) {
					for (var i = 0; i < $scope.groupTrips.length; i++) {
						if ($scope.groupTrips[i].id == response.id) {
							if (response.departureDate) response.departureDate = new Date(response.departureDate);
							if (response.returnDate) response.returnDate = new Date(response.returnDate);
							$scope.groupTrips[i] = response;
							break;
						}
					}
					$scope.saving = false;
					$scope.editMode = false;
					$('#addModal').modal('hide');
					$scope.newGroupTrip = {
						mailBody: generateMailBody(),
						mailAttachments: []
					};
					$scope.serverError = false;
				}
			).error(function (err) {
				$scope.serverError = true;
				$scope.serverErrorMessage = "An error occured at the server side: " + err;
			});
		}
	};
	$scope.openAddDialog = function () {
		$scope.newGroupTrip = {
			mailBody: generateMailBody(),
			mailAttachments: []
		};
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

	function generateMailBody() {
		return `<table style="width: 100%"><tr><td style="direction: ltr; padding: 20px"><p>Hi,</p><p>TRIPDIZER is excited to announce the dates of its first group trip to {NAME}!</p><p>We will explore {NAME} from {DepartureDate} to {ReturnDate}</p><p>Attached is the detailed itinerary including booking and payment information.</p><p>We look forward to having you on our next trip :)</p></td><td style="direction: rtl; padding: 20px"><p>أهلا</p><p>إحنا في تريب ديزر متحمسين جدا لإعلان مواعيد أول رحلة ل{NAME}.</p><p>حنكتشف {NAME} مع بعض من {DepartureDate} إلى {ReturnDate}.</p><p>مرفق في الرسالة كل تفاصيل الحجز و طريقة الدفع.</p><p>مستنينك معانا في رحلتنا الجاية.</p></td></tr><tr><td style="direction: ltr; padding: 20px">Best Regards,<br><b>Tripdizer Bookings Team</b><br>+2 010-1907-5876<br><a href="tripdizer.com">www.tripidzer.com</a></td></tr></table>`;
	}

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
				.sort((a, b) => b.isNew - a.isNew)
			for (let i = 0; i < $scope.groupTrips.length; ++i) {
				if ($scope.groupTrips[i].departureDate) $scope.groupTrips[i].departureDate = new Date($scope.groupTrips[i].departureDate);
				if ($scope.groupTrips[i].returnDate) $scope.groupTrips[i].returnDate = new Date($scope.groupTrips[i].returnDate);
			}
		});
		ItinerariesService.getAll().then(function (itineraries) {
			$scope.itineraries = itineraries;
		});
	};

	$scope.initialize();
}]);