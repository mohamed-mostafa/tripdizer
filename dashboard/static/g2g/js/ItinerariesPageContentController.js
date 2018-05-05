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
		$scope.introductionMissing = false;
		$scope.includesMissing = false;
		$scope.excludesMissing = false;
		$scope.image1Missing = false;
		$scope.image2Missing = false;
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
		if ($scope.newItinerary.introduction == null || $scope.newItinerary.introduction == "") {
			$scope.introductionMissing = true;
		}
		if ($scope.newItinerary.includes == null || $scope.newItinerary.includes == "") {
			$scope.includesMissing = true;
		}
		if ($scope.newItinerary.excludes == null || $scope.newItinerary.excludes == "") {
			$scope.excludesMissing = true;
		}
		if ($scope.newItinerary.image1 == null || $scope.newItinerary.image1 == "" || !isUrl($scope.newItinerary.image1)) {
			$scope.image1Missing = true;
		}
		if ($scope.newItinerary.image2 == null || $scope.newItinerary.image2 == "" || !isUrl($scope.newItinerary.image2)) {
			$scope.image2Missing = false;
		}
		return $scope.en_nameMissing !== true && $scope.ar_nameMissing !== true &&
			$scope.en_descriptionMissing !== true && $scope.ar_descriptionMissing !== true &&
			$scope.dailySpendingsMissing !== true && $scope.needsVisaMissing !== true &&
			$scope.includesMissing !== true && $scope.excludesMissing !== true &&
			$scope.introductionMissing !== true && $scope.image1Missing !== true && $scope.image2Missing !== true
	};
	$scope.addItinerary = function (close) {
		if ($scope.newItineraryIsValid()) {
			$scope.saving = true;
			$http.put($rootScope.serverURL + "/itinerary", {
				itinerary: $scope.newItinerary
			}).success(
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
			$http.post($rootScope.serverURL + "/itinerary", {
				itinerary: $scope.newItinerary
			}).success(
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
				response.seasons[i].start = new Date(response.seasons[i].start);
				response.seasons[i].end = new Date(response.seasons[i].end);
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
		}).error(function (err) {
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
	$scope.getCountryById = function (id) {
		for (let i = 0; i < $scope.countries.length; ++i) {
			if ($scope.countries[i].id == id) return $scope.countries[i];
		}
	}

	function isUrl(str) {
		regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
		if (regexp.test(str)) return true;
		else return false;
	}
	$scope.initialize = function () {
		$scope.resetValidationFlags();
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

	$scope.removeCountry = function (index) {
		$scope.newItinerary.countries.splice(index, 1);
	}
	$scope.addCountry = function (index) {
		$scope.newItinerary.countries.push({});
	}
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
});