/**
 * 
 */

g2gControlCenterApplication.controller("ItinerariesPageContentController", ['$rootScope', '$scope', '$http', 'ItinerariesService', 'CountriesService', function ($rootScope, $scope, $http, ItinerariesService, CountriesService) {
	// fields
	$scope.countries = [];
	$scope.itineraries = [];

	// validation flags
	$scope.serverError = false;
	$scope.serverErrorMessage = "";
	// form fields
	$scope.newItinerary = {};
	$scope.editMode = false;

	$scope.loading = false;
	$scope.saving = false;
	$scope.currentId = 0;

	// functions
	$scope.resetValidationFlags = function () {
		$scope.en_nameMissing = false;
		$scope.ar_nameMissing = false;
		$scope.en_descriptionMissing = false;
		$scope.ar_descriptionMissing = false;
		$scope.dailySpendingsMissing = false;
		$scope.starsMissing = false;
		$scope.serverError = false;
		$scope.serverErrorMessage = "";
	};
	$scope.newItineraryIsValid = function () {
		$scope.resetValidationFlags();
		if ($scope.newItinerary.en_name == null || $scope.newItinerary.en_name == "") {
			$scope.en_nameMissing = true;
		}
		if ($scope.newItinerary.ar_name == null || $scope.newItinerary.ar_name == "") {
			$scope.ar_nameMissing = true;
		}
		if ($scope.newItinerary.en_description == null || $scope.newItinerary.en_description == "") {
			$scope.en_descriptionMissing = true;
		}
		if ($scope.newItinerary.ar_description == null || $scope.newItinerary.ar_description == "") {
			$scope.ar_descriptionMissing = true;
		}
		if ($scope.newItinerary.dailySpendings == null || $scope.newItinerary.dailySpendings == "") {
			$scope.dailySpendingsMissing = true;
		}
		if ($scope.newItinerary.stars == null || $scope.newItinerary.stars == "") {
			$scope.starsMissing = true;
		}
		return $scope.en_nameMissing !== true && $scope.ar_nameMissing !== true &&
			$scope.en_descriptionMissing !== true && $scope.ar_descriptionMissing !== true &&
			$scope.dailySpendingsMissing !== true && $scope.starsMissing !== true
	};
	$scope.addItinerary = function (close) {
		if ($scope.newItineraryIsValid()) {
			$scope.saving = true;
			$http.put($rootScope.serverURL + "/itinerary", { itinerary: $scope.newItinerary }
			).success(
				function (response) {
					$scope.saving = false;
					$scope.itineraries.push(response);
					if (close) {
						$('#addItineraryModal').modal('hide');
					}
					$scope.newItinerary = {};
				}
				).error(function (err) {
					$scope.saving = false;
					$scope.serverError = true;
					$scope.serverErrorMessage = "An error occured at the server side: " + err;
				});
		}
	};
	$scope.editItinerary = function (id) {
		console.log($scope.newItinerary);
		console.log($scope.newItineraryIsValid());
		$scope.resetValidationFlags();
		if ($scope.newItineraryIsValid()) {
			$scope.saving = true;
			$http.post($rootScope.serverURL + "/itinerary", { itinerary: $scope.newItinerary }
			).success(
				function (response) {
					for (var i = 0; i < $scope.itineraries.length; i++) {
						if ($scope.itineraries[i].id == $scope.newItinerary.id) {
							$scope.itineraries[i] = $scope.newItinerary;
							break;
						}
					}
					$scope.saving = false;
					$scope.editMode = false;
					$('#addItineraryModal').modal('hide');
					$scope.newItinerary = {};
				}
				).error(function (err) {
					$scope.newItinerary = {};
					$scope.editMode = false;
					$scope.saving = false;
					$scope.serverError = true;
					$scope.serverErrorMessage = "An error occured at the server side: " + err;
				});
		}
	};
	$scope.openEditDialog = function (id) {
		$scope.editMode = true;
		for (var i = 0; i < $scope.itineraries.length; i++) {
			if ($scope.itineraries[i].id == id) {
				$scope.newItinerary = { ...$scope.itineraries[i] };
			}
		}
		$('#addItineraryModal').modal('show');
	};
	$scope.openAddDialog = function (id) {
		$scope.newItinerary = {};
		$scope.editMode = false;
		$('#addItineraryModal').modal('show');
	};
	$scope.buildTable = function () {
		// initialize the table
		$(function () {
			$('#itinerariesTable').dataTable({
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
		ItinerariesService.getAll().then(function (itineraries) {
			$scope.itineraries = itineraries;
		});

		CountriesService.getAll().then(function (countries) {
			$scope.countries = countries;
		});
	};

	$scope.initialize();
}]);