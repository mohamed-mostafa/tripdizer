/**
 * 
 */

tripdizerApplication.controller("ReservationController", ['$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location) {
	// fields
	$scope.sources = [
		{id: 1, name:"Cairo"},
		{id: 2, name:"Alexandria"}
	],
	$scope.destinations = [
		{id: 1, name:"Bali"},
		{id: 2, name:"Kuala Lumpur"},
		{id: 3, name:"Bangkok"},
		{id: 4, name:"Singapore"},
		{id: 5, name:"Phuket"}
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
	
	$scope.numberOfTravelers = 1,
	$scope.otherType = "",
	
	$scope.secondDestinationShown = false,
	$scope.thirdDestinationShown = false,
	
	$scope.tripTypeString = "Solo Trip",
	$scope.budgetString = "Mid Range",
	
	$scope.submitting = false,
	$scope.submittingError = false,
	
	$scope.activitiesPercent = 0,
	$scope.beachesPercent = 0,
	$scope.nightlifePercent = 0,
	$scope.naturePercent = 0,
	$scope.historyPercent = 0,
	$scope.shoppingPercent = 0,
	
	$scope.activitiesTitle = "الأنشطة :0%";
	$scope.shoppingTitle = "التسوق :0%";
	$scope.beachesTitle = "الشواطئ :0%";
	$scope.nightlifeTitle = "الحياة الليلية :0%";
	$scope.natureTitle = "الطبيعة :0%";
	$scope.historyTitle = "التاريخ :0%";
	
	$scope.activitiesChanged = function() {
		$scope.activitiesTitle = "Activities: " + $scope.activitiesPercent + "%";
	},
	$scope.beachesChanged = function() {
		$scope.beachesTitle = "Beaches: " + $scope.beachesPercent + "%";
	},
	$scope.nightlifeChanged = function() {
		$scope.nightlifeTitle = "Nightlife: " + $scope.nightlifePercent + "%";
	},
	$scope.natureChanged = function() {
		$scope.natureTitle = "Nature: " + $scope.naturePercent + "%";
	},
	$scope.historyChanged = function() {
		$scope.historyTitle = "History: " + $scope.historyPercent + "%";
	},
	$scope.shoppingChanged = function() {
		$scope.shoppingTitle = "Shopping: " + $scope.shoppingPercent + "%";
	},
	
    $scope.request = {
					traveler: {
						name: "",
						mobile: "",
						emailAddress: "",
						dateOfBirth: "",
					},
					questionAnswers: [
						{
							question: {id: 1, text: "Destinations", type: "MCQ"},
							answer: {answer: ""}
						},
						{
							question: {id: 2, text: "Dates", type: "MCQ"},
							answer: {answer: ""}
						},
						{
							question: {id: 3, text: "Type", type: "MCQ"},
							answer: {answer: ""}
						},
						{
							question: {id: 4, text: "Budget", type: "MCQ"},
							answer: {answer: ""}
						},
						{
							question: {id: 5, text: "Interests", type: "MCQ"},
							answer: {answer: ""}
						},
						{
							question: {id: 6, text: "Visa", type: "MCQ"},
							answer: {answer: ""}
						},
						{
							question: {id: 7, text: "TourGuide", type: "MCQ"},
							answer: {answer: ""}
						},
						{
							question: {id: 8, text: "SpecialRequests", type: "MCQ"},
							answer: {answer: ""}
						},
					],
				};
	
	$scope.otherSelected = false,
	
    // functions
	$scope.honeymoonSelected = function() {
		$scope.numberOfTravelers = 2;
		$scope.otherSelected = false;
	},
	$scope.soloSelected = function() {
		$scope.numberOfTravelers = 1;
		$scope.otherSelected = false;
	},
	$scope.familySelected = function() {
		$scope.numberOfTravelers = 3;
		$scope.otherSelected = false;
	},
	$scope.groupSelected = function() {
		$scope.numberOfTravelers = 4;
		$scope.otherSelected = false;
	},
	$scope.businessSelected = function() {
		$scope.numberOfTravelers = 1;
		$scope.otherSelected = false;
	},
	$scope.joinGroupSelected = function() {
		$scope.numberOfTravelers = 4;
		$scope.otherSelected = false;
	},
	
	$scope.getDestinations = function() {
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
	
    $scope.addDestination = function() {
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
    $scope.removeSecondDestination = function() {
    	$scope.secondDestinationShown = false;
    };
    $scope.removeThirdDestination = function() {
    	$scope.thirdDestinationShown = false;
    };
	
    $scope.requestNumber = 0;
    
	$scope.submitTravelRequest = function() {
		
		$scope.submitting = true;
		$scope.submittingError = false;
	
		$scope.request.questionAnswers[0].answer.answer = "Starting & ending at: " + $scope.selectedSource + ", travelling to: " + $scope.getDestinations();
		
		$scope.request.questionAnswers[1].answer.answer = "From: " + $scope.selectedFrom + ", To: " + $scope.selectedTo;
		if ($scope.plusOrMinusThreeDays) $scope.request.questionAnswers[1].answer.answer += " - Flexible (+/- 3 days)";
		
		if ($scope.tripTypeString == "Other") {
			$scope.request.questionAnswers[2].answer.answer = "Other travel : " + $scope.otherType + " (" + $scope.numberOfTravelers + " persons)";
		} else {
			$scope.request.questionAnswers[2].answer.answer = $scope.tripTypeString + " (" + $scope.numberOfTravelers + " persons)";
		}
		
		$scope.request.questionAnswers[3].answer.answer = $scope.budgetString;
		if ($scope.budgetString == "Own Budget") $scope.request.questionAnswers[3].answer.answer = $scope.request.questionAnswers[3].answer.answer + ": " + $scope.myOwnBudget + "EGP";
		if ($scope.budgetString == "Super Economy") $scope.request.questionAnswers[3].answer.answer = $scope.request.questionAnswers[3].answer.answer + "(Dorms, Public Transportation, ...";
		if ($scope.budgetString == "Economy") $scope.request.questionAnswers[3].answer.answer = $scope.request.questionAnswers[3].answer.answer + "(Hostels, Guesthouses, 2-star hotels, budget flights, ...)";
		if ($scope.budgetString == "Mid Range") $scope.request.questionAnswers[3].answer.answer = $scope.request.questionAnswers[3].answer.answer + "(Service apartments, 3-4 stars hotels, Airport transportation, Optional Guide, ...)";
		if ($scope.budgetString == "Splurge") $scope.request.questionAnswers[3].answer.answer = $scope.request.questionAnswers[3].answer.answer + "(Luxuary hotels, Full board, Optional guide, Private transportation)";
		
		$scope.request.questionAnswers[4].answer.answer = "Activities:" + $scope.activitiesPercent + "%, History: " + $scope.historyPercent + "%, Nightlife: " + $scope.nightlifePercent + "%, Beaches: " + $scope.beachesPercent + "%, Natrue: " + $scope.naturePercent + "%, Shopping: " + $scope.shoppingPercent + "%";
		
		if ($scope.needVisaAssistance == true) {
			$scope.request.questionAnswers[5].answer.answer = "Visa assistance needed";
		} else {
			$scope.request.questionAnswers[5].answer.answer = "Visa assistance not needed";
		}

		if ($scope.needTourGuide == true) {
			$scope.request.questionAnswers[6].answer.answer = "Tour guide needed";
		} else {
			$scope.request.questionAnswers[6].answer.answer = "Tour guide not needed";
		}
		
		$scope.request.questionAnswers[7].answer.answer = $scope.specialRequests;
	
		$http.put($rootScope.serverURL + "/request/place", {request: $scope.request}).success(function(response) {
			console.log("Request submitted");
			$scope.submitting = false;
			$scope.requestNumber = response.id;
		}).error(function(err) {
			$scope.submitting = false;
			$scope.submittingError = true;
			console.log("Failed to submit request: " + JSON.stringify(err));
		});
	},
	
	/************Initialize Map S*********************************/
	$scope.map = null;
	$scope.refreshMap = function() {
		var pos = {
			lat: 30.0444
			, lng: 31.2357
		};
		var mapOptions = {
			zoom: 4
			, center: pos
			, disableDefaultUI: true
			, zoomControl: true
			, };
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
		$scope.map.setCenter({lat: 30.0444, lng: 31.2357})
		google.maps.event.trigger($scope.map, 'resize');		
	};
	
	$scope.getMap = function() {
		return $scope.map;
	}
	
	$scope.refreshMap();
	
	$scope.setBtnStyle = function() {
		if ($('li.step.current').hasClass('first')){
		   $(".actions").addClass("firstStep");
		}   
	}
	
	$scope.setBtnStyle();
	
}]);