/**
 * 
 */

g2gControlCenterApplication.controller("CountriesPageContentController", ['$rootScope', '$scope', '$http', 'CountriesService', 'PurposesService', 'BudgetCategoriesService', 'InterestsService', function ($rootScope, $scope, $http, CountriesService, PurposesService, BudgetCategoriesService, InterestsService) {
	// fields
	$scope.countries = [];

	// validation flags
	$scope.nameMissing = false;
	$scope.emailMissing = false;
	$scope.serverError = false;
	$scope.serverErrorMessage = "";
	// form fields
	$scope.newCountry = {};
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
		$scope.thumbnailMissing = false;
		$scope.latMissing = false;
		$scope.lngMissing = false;
		$scope.budgetMissing = false;
		$scope.purposeMissing = false;
		$scope.serverError = false;
		$scope.serverErrorMessage = "";
	};
	$scope.newCountryIsValid = function () {
		$scope.resetValidationFlags();
		if ($scope.newCountry.en_name == null || $scope.newCountry.en_name == "") {
			$scope.en_nameMissing = true;
		}
		if ($scope.newCountry.ar_name == null || $scope.newCountry.ar_name == "") {
			$scope.ar_nameMissing = true;
		}
		if ($scope.newCountry.en_description == null || $scope.newCountry.en_description == "") {
			$scope.en_descriptionMissing = true;
		}
		if ($scope.newCountry.ar_description == null || $scope.newCountry.ar_description == "") {
			$scope.ar_descriptionMissing = true;
		}
		if ($scope.newCountry.thumbnail == null || $scope.newCountry.thumbnail == "") {
			$scope.thumbnailMissing = true;
		}
		if ($scope.newCountry.lat == null || $scope.newCountry.lat == "") {
			$scope.latMissing = true;
		}
		if ($scope.newCountry.lng == null || $scope.newCountry.lng == "") {
			$scope.lngMissing = true;
		}
		if ($scope.newCountry.budget == null || $scope.newCountry.budget == "") {
			$scope.budgetMissing = true;
		}
		if ($scope.newCountry.purpose == null || $scope.newCountry.purpose == "") {
			$scope.purposeMissing = true;
		}
		return $scope.en_nameMissing !== true && $scope.ar_nameMissing !== true &&
			$scope.en_descriptionMissing !== true && $scope.ar_descriptionMissing !== true &&
			$scope.latMissing !== true && $scope.lngMissing !== true &&
			$scope.thumbnailMissing !== true && $scope.budgetMissing !== true && $scope.purposeMissing !== true
	};
	$scope.addCountry = function (close) {
		if ($scope.newCountryIsValid()) {
			$scope.saving = true;
			console.log($scope.newCountry);
			$http.put($rootScope.serverURL + "/country", { country: $scope.newCountry }
			).success(
				function (response) {
					$scope.saving = false;
					$scope.countries.push(response);
					if (close) {
						$('#addCountryModal').modal('hide');
					}
				}
				).error(function (err) {
					$scope.saving = false;
					$scope.serverError = true;
					$scope.serverErrorMessage = "An error occured at the server side: " + err;
				});
		}
	};
	$scope.editCountry = function (id) {
		console.log($scope.newCountry);
		console.log($scope.newCountryIsValid());
		$scope.resetValidationFlags();
		if ($scope.newCountryIsValid()) {
			$scope.saving = true;
			$http.post($rootScope.serverURL + "/country", { country: $scope.newCountry }
			).success(
				function (response) {
					for (var i = 0; i < $scope.countries.length; i++) {
						if ($scope.countries[i].id == $scope.newCountry.id) {
							$scope.countries[i] = $scope.newCountry;
							break;
						}
					}
					$scope.saving = false;
					$scope.editMode = false;
					$('#addCountryModal').modal('hide');
				}
				).error(function (err) {
					$scope.newCountry = {};
					$scope.editMode = false;
					$scope.saving = false;
					$scope.serverError = true;
					$scope.serverErrorMessage = "An error occured at the server side: " + err;
				});
		}
	};
	$scope.openEditDialog = function (id) {
		$scope.editMode = true;
		for (var i = 0; i < $scope.countries.length; i++) {
			if ($scope.countries[i].id == id) {
				$scope.newCountry = $scope.countries[i];
			}
		}
		$('#addCountryModal').modal('show');
	};
	$scope.openAddDialog = function (id) {
		$scope.editMode = false;
		$('#addCountryModal').modal('show');
	};
	$scope.buildTable = function () {
		// initialize the table
		$(function () {
			$('#countriesTable').dataTable({
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
		CountriesService.getAll().then(function (countries) {
			$scope.countries = countries;
		});

		PurposesService.getAll().then(function (purposes) {
			$scope.purposes = purposes;
		});

		BudgetCategoriesService.getAll().then(function (budgetCategories) {
			$scope.budgetCategories = budgetCategories;
		});

		InterestsService.getAll().then(function (interests) {
			$scope.interests = interests;
		});
	};

	$scope.initialize();
}]);