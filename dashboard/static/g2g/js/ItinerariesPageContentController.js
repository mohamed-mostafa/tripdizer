/**
 * 
 */

g2gControlCenterApplication.controller("ItinerariesPageContentController", ['$rootScope', '$scope', '$http', 'ItinerariesService', 'CountriesService', 'BudgetCategoriesService', 'PurposesService', 'InterestsService', function ($rootScope, $scope, $http, ItinerariesService, CountriesService, BudgetCategoriesService, PurposesService, InterestsService) {
	// fields
	$scope.countries = [];
	$scope.purposes = [];
	$scope.interests = [];
	$scope.budgetCategories = [];
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
		$scope.needsVisaMissing = false;
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
		if ($scope.newItinerary.needsVisa == null || $scope.newItinerary.needsVisa == "") {
			$scope.needsVisaMissing = true;
		}
		return $scope.en_nameMissing !== true && $scope.ar_nameMissing !== true &&
			$scope.en_descriptionMissing !== true && $scope.ar_descriptionMissing !== true &&
			$scope.dailySpendingsMissing !== true && $scope.needsVisaMissing !== true
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
					$('#detailsModal').modal('hide');
					$scope.newItinerary = {};
					$scope.serverError = false;
				}
				).error(function (err) {
					$scope.serverError = true;
					$scope.serverErrorMessage = "An error occured at the server side: " + err;
				});
		}
	};
	$scope.openAddDialog = function (id) {
		$scope.newItinerary = {};
		$scope.editMode = false;
		$('#addItineraryModal').modal('show');
	};
	$scope.openDetailsDialog = function (id) {
		$scope.editMode = true;
		$http.get($rootScope.serverURL + "/itinerary/" + id).success(function (response) {
			for (let i = 0; i < response.seasons.length; i++) {
				response.seasons[i].season_start = response.seasons[i].season_start.split('T')[0];
				response.seasons[i].season_end = response.seasons[i].season_end.split('T')[0];
			}
			const constBudgetCategories = {};
			for (let i = 0; i < $scope.budgetCategories.length; i++) {
				const budget = response.budgetCategories.find(b => b.budget_category_Id === $scope.budgetCategories[i].id);
				if (budget)
					constBudgetCategories[$scope.budgetCategories[i].id] = budget.Percentage;
				else
					constBudgetCategories[$scope.budgetCategories[i].id] = 0;
			}
			const constPurposes = {};
			for (let i = 0; i < $scope.purposes.length; i++) {
				const purpose = response.purposes.find(p => p.travel_purpose_Id === $scope.purposes[i].id);
				if (purpose)
					constPurposes[$scope.purposes[i].id] = purpose.Percentage;
				else
					constPurposes[$scope.purposes[i].id] = 0;
			}
			const constInterests = {};
			for (let i = 0; i < $scope.interests.length; i++) {
				const interest = response.interests.find(p => p.interests_Id === $scope.interests[i].id);
				if (interest)
					constInterests[$scope.interests[i].id] = interest.Percentage;
				else
					constInterests[$scope.interests[i].id] = 0;
			}
			$scope.newItinerary = {
				...response,
				budgetCategories: constBudgetCategories,
				purposes: constPurposes,
				interests: constInterests
			};
			$('#detailsModal').modal('show');
		}
		).error(function (err) {
			$scope.editMode = false;
			$scope.saving = false;
			$scope.serverError = true;
			$scope.serverErrorMessage = "An error occured at the server side: " + err;
		});
	}
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

		BudgetCategoriesService.getAll().then(function (budgetCategories) {
			$scope.budgetCategories = budgetCategories;
		});

		CountriesService.getAll().then(function (countries) {
			$scope.countries = countries;
		});

		PurposesService.getAll().then(function (purposes) {
			$scope.purposes = purposes;
		});

		InterestsService.getAll().then(function (interests) {
			$scope.interests = interests;
		});
	};

	$scope.initialize();

	$scope.removeFerry = function (index) {
		$scope.newItinerary.ferries.splice(index, 1);
	}
	$scope.addFerry = function (index) {
		$scope.newItinerary.ferries.push({});
	}
	$scope.removeFlight = function (index) {
		$scope.newItinerary.flights.splice(index, 1);
	}
	$scope.addFlight = function (index) {
		$scope.newItinerary.flights.push({});
	}
	$scope.removeHotel = function (index) {
		$scope.newItinerary.hotels.splice(index, 1);
	}
	$scope.addHotel = function (index) {
		$scope.newItinerary.hotels.push({});
	}
	$scope.removeSeason = function (index) {
		$scope.newItinerary.seasons.splice(index, 1);
	}
	$scope.addSeason = function (index) {
		$scope.newItinerary.seasons.push({});
	}
}]);