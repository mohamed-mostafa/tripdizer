/**
 * 
 */

tripdizerApplication.controller("ReservationController", ['$rootScope', '$scope', '$http', '$location', 'CountriesService', 'PurposesService', 'BudgetCategoriesService', 'InterestsService', 'ItinerariesService', function ($rootScope, $scope, $http, $location, CountriesService, PurposesService, BudgetCategoriesService, InterestsService, ItinerariesService) {
	// fields
	$scope.sources = [
		{ id: 1, name: "القاهرة" },
		{ id: 2, name: "الاسكندرية" }
	],
		$scope.destinations = [
			{ id: 1, name: "بالي" },
			{ id: 2, name: "كوالالامبور" },
			{ id: 3, name: "بانكوك" },
			{ id: 4, name: "سنغافورة" },
			{ id: 5, name: "فوكيت" }
		],

		$scope.selectedSource = "",
		$scope.selectedDestinations = [],

		$scope.selectedFrom = "",
		$scope.selectedTo = "",

		$scope.lowBudgetSelected = false,
		$scope.mediumBudgetSelected = true,
		$scope.highBudgetSelected = false,
		$scope.myOwnBudgetBudgetSelected = false,
		$scope.myOwnBudget = null;
	$scope.needVisaAssistance = false;
	$scope.needTourGuide = false;
	$scope.specialRequests = "";
	$scope.otherCountries = "";

	$scope.plusOrMinusThreeDays = false,

		$scope.numberOfAdults = 1,
		$scope.numberOfKids = 0,
		$scope.numberOfInfants = 0,
		$scope.otherType = "",

		$scope.secondDestinationShown = false,
		$scope.thirdDestinationShown = false,

		$scope.tripTypeString = "رحلة فردية",
		$scope.budgetString = "متوسط",

		$scope.submitting = false,
		$scope.submittingError = false,

		$scope.request = {
			traveler: {
				name: "",
				mobile: "",
				emailAddress: "",
				dateOfBirth: "",
			}
		};

	// functions
	$scope.selectPurpose = function (purpose) {
		$scope.selectedPurpose = purpose;
		$scope.numberOfAdults = purpose.numberOfAdults;
		$scope.numberOfKids = purpose.numberOfKids;
		$scope.numberOfInfants = purpose.numberOfInfants;
	},
		$scope.selectBudgetCategory = function (budgetCategory) {
			$scope.selectedBudgetCategory = budgetCategory;
		},

		$scope.getDestinations = function () {
			if ($scope.selectedDestinations.length == 1) {
				if ($scope.selectedDestinations[0] == 'other') {
					return $scope.otherCountries;
				} else {
					return $scope.selectedDestinations[0];
				}
			} else if ($scope.selectedDestinations.length == 2) {
				if ($scope.selectedDestinations[0] == 'other') {
					return $scope.otherCountries + " and " + $scope.selectedDestinations[1];
				} else if ($scope.selectedDestinations[1] == 'other') {
					return $scope.selectedDestinations[0] + " and " + $scope.otherCountries;
				} else {
					return $scope.selectedDestinations[0] + " and " + $scope.selectedDestinations[1];
				}
			} else if ($scope.selectedDestinations.length == 3) {
				if ($scope.selectedDestinations[0] == 'other') {
					return $scope.otherCountries + ", " + $scope.selectedDestinations[1] + " and " + $scope.selectedDestinations[2];
				} else if ($scope.selectedDestinations[1] == 'other') {
					return $scope.selectedDestinations[0] + ", " + $scope.otherCountries + " and " + $scope.selectedDestinations[2];
				} else if ($scope.selectedDestinations[2] == 'other') {
					return $scope.selectedDestinations[0] + ", " + $scope.selectedDestinations[1] + " and " + $scope.otherCountries;
				} else {
					return $scope.selectedDestinations[0] + ", " + $scope.selectedDestinations[1] + " and " + $scope.selectedDestinations[2];
				}
			}
		},

		$scope.addDestination = function () {
			if ($scope.selectedFirstDestination.split('::')[0] === 'c') {
				if ($scope.secondDestinationShown == false && $scope.thirdDestinationShown == false) {
					$scope.secondDestinationShown = true;
				} else if ($scope.secondDestinationShown == true && $scope.thirdDestinationShown == false) {
					$scope.thirdDestinationShown = true;
				} else if ($scope.secondDestinationShown == false && $scope.thirdDestinationShown == true) {
					$scope.secondDestinationShown = true;
				} else {
					// do nothing, all shown
				}
			}
		}
	$scope.countryChanged = function () {
		if ($scope.selectedFirstDestination.split('::')[0] === 'i') {
			$scope.secondDestinationShown = false;
			$scope.thirdDestinationShown = false;
			$scope.selectedDestinations[1] = 0;
			$scope.selectedDestinations[2] = 0;
			$scope.requestType = "itineraries";
		} else {
			$scope.requestType = "countries";
		}
		$scope.selectedDestinations[0] = $scope.selectedFirstDestination.split('::')[1];
	}
	$scope.removeSecondDestination = function () {
		$scope.secondDestinationShown = false;
	};
	$scope.removeThirdDestination = function () {
		$scope.thirdDestinationShown = false;
	};

	$scope.requestNumber = 0;

	$scope.submitTravelRequest = function () {

		$scope.submitting = true;
		$scope.submittingError = false;

		$scope.request.departure_date = $scope.selectedFrom;
		$scope.request.return_date = $scope.selectedTo;
		$scope.request.flexible_dates = $scope.plusOrMinusThreeDays;
		$scope.request.leaving_country = $scope.selectedSource;
		if ($scope.selectedFirstDestination.split('::')[0] === 'c') {
			delete $scope.request.itinerary_id;
			$scope.request.first_country = $scope.selectedDestinations[0];
			$scope.request.second_country = $scope.selectedDestinations[1] || 0;
			$scope.request.third_country = $scope.selectedDestinations[2] || 0;
		} else {
			$scope.request.itinerary_id = $scope.selectedDestinations[0];
			$scope.request.first_country = 1;
			$scope.request.second_country = 0;
			$scope.request.third_country = 0;
		}
		$scope.request.other_country = $scope.selectedOtherDestinations;
		$scope.request.travel_purpose = $scope.selectedPurpose.id;
		$scope.request.number_of_adults = $scope.numberOfAdults;
		$scope.request.number_of_kids = $scope.numberOfKids;
		$scope.request.number_of_infants = $scope.numberOfInfants;
		$scope.request.budget_category = $scope.selectedBudgetCategory.id;
		$scope.request.budget = $scope.myOwnBudget;
		$scope.request.visa_assistance_needed = $scope.needVisaAssistance;
		$scope.request.tour_guide_needed = $scope.needTourGuide;
		$scope.request.specialRequests = $scope.specialRequests;

		$scope.request.interests = [];
		for (var i = 0, interests = $scope.interests; i < interests.length; ++i)
			$scope.request.interests.push({ id: interests[i].id, percentage: interests[i].percent || 0 });

		$http.put($rootScope.serverURL + "/request/place", { request: $scope.request }).success(function (response) {
			console.log("Request submitted");
			$scope.submitting = false;
			$scope.requestNumber = response.id;
		}).error(function (err) {
			$scope.submitting = false;
			$scope.submittingError = true;
			console.log("Failed to submit request: " + JSON.stringify(err));
		});
	},

		/************Initialize Map S*********************************/
		$scope.map = null;
	$scope.refreshMap = function () {
		var pos = {
			lat: 30.0444
			, lng: 31.2357
		};
		var mapOptions = {
			zoom: 4
			, center: pos
			, disableDefaultUI: true
			, zoomControl: true
			,
		};
		var element = document.getElementById('flow-map-container');
		$scope.map = new google.maps.Map(element, mapOptions);
		//            google.maps.event.trigger(map, 'resize');
		markers = [], infowindows = [];
		var marker = new google.maps.Marker({
			position: pos
			, map: $scope.map
			, icon: "icon.png"
			, animation: google.maps.Animation.DROP
		});
		markers.push(marker);
		$scope.map.setCenter({ lat: 30.0444, lng: 31.2357 })
		google.maps.event.trigger($scope.map, 'resize');
	};

	$scope.getMap = function () {
		return $scope.map;
	}

	$scope.refreshMap();

	$scope.setBtnStyle = function () {
		if ($('li.step.current').hasClass('first')) {
			$(".actions").addClass("firstStep");
		}
	}

	$scope.setBtnStyle();

	CountriesService.getAll('AR').then(function (countries) {
		$scope.countries = countries;
	});

	PurposesService.getAll('AR').then(function (purposes) {
		$scope.purposes = purposes;
		$scope.selectPurpose($scope.purposes[0]);
	});

	BudgetCategoriesService.getAll('AR').then(function (budgetCategories) {
		$scope.budgetCategories = budgetCategories;
		$scope.selectBudgetCategory($scope.budgetCategories[0]);
	});

	InterestsService.getAll('AR').then(function (interests) {
		$scope.interests = interests;
		for (var i = 0; i < $scope.interests.length; i++) {
			$scope.interests[i].percent = 0;
		}
	});

	ItinerariesService.getAll('AR').then(function (itineraries) {
		$scope.itineraries = itineraries
	});

}]);