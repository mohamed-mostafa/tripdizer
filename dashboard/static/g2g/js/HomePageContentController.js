/**
 * 
 */

g2gControlCenterApplication.controller("HomePageContentController", ['$rootScope', '$scope', '$http', '$location', 'CountriesService', 'PurposesService', 'BudgetCategoriesService', 'InterestsService', 'ItinerariesService', 'ReferralTypesService', 'StatusesService', function ($rootScope, $scope, $http, $location, CountriesService, PurposesService, BudgetCategoriesService, InterestsService, ItinerariesService, ReferralTypesService, StatusesService) {
	// fields
	$scope.statuses = [];
	$scope.currentOrders = [];
	$scope.total = {
		statusIds: '',
		count: 0,
		revenue: 0,
		profit: 0,
		numberOfTravelers: 0
	};
	$scope.refreshingOrders = false;
	$scope.markingOrder = false;
	$scope.currentOrder = null;
	$scope.selectedUser = null;
	$scope.searchCriteria = {};
	$scope.users = [];
	$scope.loading = false;
	$scope.serverError = false;
	$scope.serverErrorMessage = "";
	$scope.excelFields = {
		'id': 'ID',
		'traveler.name': 'Traveler Name',
		'traveler.mobile': 'Traveler Mobile',
		'traveler.emailAddress': 'Traveler Email',
		'traveler.dateOfBirth': 'Traveler Birthdate',
		'date': 'Request Date',
		'status': 'Request Status',
		'comments': 'Comments',
		'revenue': 'Revenue',
		'profit': 'Profit',
		'interests.0.percentage': 'Activities',
		'interests.1.percentage': 'History',
		'interests.2.percentage': 'Nightlife',
		'interests.3.percentage': 'Beaches',
		'interests.4.percentage': 'Nature',
		'interests.5.percentage': 'Shopping',
		'departureDate': 'Departure Date',
		'returnDate': 'Return Date',
		'flexibleDates': 'Flexible Dates',
		'leavingCountry': 'Leaving Country',
		'firstCountryName': 'First Country',
		'otherCountry': 'Other Country',
		'secondCountryName': 'Second Country',
		'thirdCountryName': 'Third Country',
		'travelPurposeName': 'Travel Purpose',
		'numberOfTravelers': 'Number Of Travelers',
		'budgetCategoryName': 'Budget Category',
		'budget': 'Budget',
		'isVisaAssistanceNeeded': 'Visa Assistance Needed',
		'isTourGuideNeeded': 'Tour Guide Needed',
	};
	$scope.currentRequest = 1;

	// functions
	$scope.refreshOrdersCount = function (statusId) {
		let query = statusId;
		const statusIndex = $scope.statuses.findIndex(state => state.id === statusId);
		const statusTitle = statusIndex !== -1 ? $scope.statuses[statusIndex].title : '';
		if (statusTitle === 'Total') {
			$scope.total.statusIds = [];
			for (var i = 0; i < $scope.statuses.length; ++i) $scope.total.statusIds.push($scope.statuses[i].id);
			query = $scope.total.statusIds;
		} else {
			query = [$scope.statuses[statusIndex].id]
		}
		$scope.statuses[statusIndex].refresh = true;
		$http.get($rootScope.serverURL + "/request/statuses/count?statuses=" + query + "&filter=" + JSON.stringify($scope.searchCriteria)).success(
			function (response) {
				if (!response.count) response.count = 0;
				if (!response.revenue) response.revenue = 0;
				if (!response.profit) response.profit = 0;
				if (!response.numberOfTravelers) response.numberOfTravelers = 0;
				$scope.statuses[statusIndex].count = response.count;
				$scope.statuses[statusIndex].revenue = response.revenue;
				$scope.statuses[statusIndex].profit = response.profit;
				$scope.statuses[statusIndex].numberOfTravelers = response.numberOfTravelers;
				$scope.statuses[statusIndex].refresh = false;
				$scope.calculateTotals();
			}
		).error(function (err) {
			$scope.statuses[statusIndex].count = "N/A";
			$scope.statuses[statusIndex].refresh = false;
		});
	};
	$scope.refreshOrders = function (statusId) {
		$scope.currentRequest = statusId;
		const statusIndex = $scope.statuses.findIndex(state => state.id === statusId);
		const statusTitle = statusIndex !== -1 ? $scope.statuses[statusIndex].title : '';
		if (statusTitle === 'Total') {
			$scope.total.statusIds = [];
			for (var i = 0; i < $scope.statuses.length; ++i) $scope.total.statusIds.push($scope.statuses[i].id);
			$scope.currentRequest = $scope.total.statusIds;
		}
		$scope.refreshingOrders = true;
		$scope.collapseAdvancedSearchIfExpanded();

		$http.get($rootScope.serverURL + "/request/statuses/summaries?statuses=" + $scope.currentRequest).success(
			function (response) {
				response = response.sort((a, b) => b.id - a.id).map(function (request) {
					if (request.date) request.date = new Date(request.date);
					if (request.traveler) request.traveler.dateOfBirth = new Date(request.traveler.dateOfBirth);
					if (request.departureDate) request.departureDate = new Date(request.departureDate);
					if (request.returnDate) request.returnDate = new Date(request.returnDate);
					return request;
				});
				$scope.currentOrders = response;
				$scope.originalOrders = response;
				$scope.searchOrders();
				$scope.refreshingOrders = false;
			}
		).error(function (err) {
			$scope.currentOrders = [];
			$scope.refreshingOrders = false;
		});
	};
	$scope.changeOrderStatus = function (order) {
		$scope.markingOrder = true;
		$http.post($rootScope.serverURL + "/request/status", {
			requestId: order.id,
			status: order.status
		}).success(
			function () {
				$scope.markingOrder = false;
				$scope.refreshContent();
			}
		).error(function (err) {
			$scope.markingOrder = false;
		});
	};
	$scope.showMailModal = function (type, request) {
		$scope.email = {
			recipients: [],
			recipientsMissing: false,
			subjectMissing: false,
			bodyMissing: false,
			attachments: [],
			type: type
		};
		if (Array.isArray(request)) $scope.email.recipients = request;
		else $scope.email.recipients.push(request);
		$('#emailModal').modal('show');
	};
	$scope.sendMail = function (request) {
		$scope.email.recipientsMissing = $scope.email.subjectMissing = $scope.email.bodyMissing = false;
		if ($scope.email.recipients.length <= 0) $scope.email.recipientsMissing = true;
		if (!$scope.email.subject) $scope.email.subjectMissing = true;
		if (!$scope.email.body) $scope.email.bodyMissing = true;
		if (!$scope.email.recipientsMissing && !$scope.email.subjectMissing && !$scope.email.bodyMissing) {
			$http.post($rootScope.serverURL + "/request/statuses/sendmails", {
				email: $scope.email
			}).success(
				function (response) {
					$('#emailModal').modal('hide');
				}).error(function (err) {
				$scope.serverError = true;
				$scope.serverErrorMessage = err;
				$('#emailModal').modal('hide');
			});
		}
	};
	$scope.toggleCheckBox = function (item, list) {
		if (!list) list = [];
		var idx = list.indexOf(item);
		if (idx > -1) list.splice(idx, 1);
		else list.push(item);
	};
	$scope.existsCheckBox = function (item, list) {
		if (!list) list = [];
		return list.indexOf(item) > -1;
	};
	$scope.calculateTotals = function () {
		var total = {
			count: 0,
			revenue: 0,
			profit: 0,
			numberOfTravelers: 0
		};
		for (var i = 0, statuses = $scope.statuses; i < statuses.length; ++i) {
			total.count += statuses[i].count;
			total.revenue += statuses[i].revenue;
			total.profit += statuses[i].profit;
			total.numberOfTravelers += statuses[i].numberOfTravelers;
		}
		$scope.total.count = total.count;
		$scope.total.revenue = total.revenue;
		$scope.total.profit = total.profit;
		$scope.total.numberOfTravelers = total.numberOfTravelers;
	};
	$scope.refreshRegisteredUsersCount = function () {
		$scope.refreshingRegisteredUsersCount = true;
		$http.get($rootScope.serverURL + "/user/users/count").success(
			function (response) {
				$scope.registeredUsersCount = response.registeredUsersIds;
				$scope.refreshingRegisteredUsersCount = false;
			}
		).error(function (err) {
			$scope.registeredUsersCount = "N/A";
			$scope.refreshingRegisteredUsersCount = false;
		});
	};
	$scope.collapseAdvancedSearchIfExpanded = function () {
		var advancedSearchBoxExpanded = $('#collapseExpandIcon').hasClass('fa-minus');
		if (advancedSearchBoxExpanded) {
			$('#collapseExpandBtn').trigger('click');
		}
	};
	$scope.getAllUsersToAssign = function () {
		$http.get($rootScope.serverURL + "/users/ToAssign").success(
			function (response) {
				$scope.users = response;
			}
		).error(function (err) {
			$scope.users = [];
		});
	};
	$scope.searchOrders = function () {
		$scope.currentOrders = $scope.originalOrders;

		if ($scope.searchCriteria.name) {
			var ordersArr = [];
			for (let i = 0; i < $scope.currentOrders.length; ++i)
				if ($scope.currentOrders[i].traveler.name.toLowerCase().includes($scope.searchCriteria.name.toLowerCase())) ordersArr.push($scope.currentOrders[i]);
			$scope.currentOrders = ordersArr;
		} else delete $scope.searchCriteria.name;

		if ($scope.searchCriteria.status) {
			$scope.currentRequest = $scope.searchCriteria.status;
			var ordersArr = [];
			for (let i = 0; i < $scope.currentOrders.length; ++i)
				if ($scope.currentOrders[i].status === $scope.searchCriteria.status) ordersArr.push($scope.currentOrders[i]);
			$scope.currentOrders = ordersArr;
		} else delete $scope.searchCriteria.status;

		if ($scope.searchCriteria.from) {
			var ordersArr = [];
			for (let i = 0; i < $scope.currentOrders.length; ++i)
				if (new Date($scope.currentOrders[i].date).setHours(0, 0, 0, 0) >= new Date($scope.searchCriteria.from).setHours(0, 0, 0, 0)) ordersArr.push($scope.currentOrders[i]);
			$scope.currentOrders = ordersArr;
		} else delete $scope.searchCriteria.from;

		if ($scope.searchCriteria.to) {
			var ordersArr = [];
			for (let i = 0; i < $scope.currentOrders.length; ++i)
				if (new Date($scope.currentOrders[i].date).setHours(0, 0, 0, 0) <= new Date($scope.searchCriteria.to).setHours(0, 0, 0, 0)) ordersArr.push($scope.currentOrders[i]);
			$scope.currentOrders = ordersArr;
		} else delete $scope.searchCriteria.to;

		if ($scope.searchCriteria.departureDateFrom) {
			var ordersArr = [];
			for (let i = 0; i < $scope.currentOrders.length; ++i)
				if (new Date($scope.currentOrders[i].departureDate).setHours(0, 0, 0, 0) >= new Date($scope.searchCriteria.departureDateFrom).setHours(0, 0, 0, 0)) ordersArr.push($scope.currentOrders[i]);
			$scope.currentOrders = ordersArr;
		} else delete $scope.searchCriteria.departureDateFrom;

		if ($scope.searchCriteria.departureDateTo) {
			var ordersArr = [];
			for (let i = 0; i < $scope.currentOrders.length; ++i)
				if (new Date($scope.currentOrders[i].departureDate).setHours(0, 0, 0, 0) <= new Date($scope.searchCriteria.departureDateTo).setHours(0, 0, 0, 0)) ordersArr.push($scope.currentOrders[i]);
			$scope.currentOrders = ordersArr;
		} else delete $scope.searchCriteria.departureDateTo;

		if ($scope.searchCriteria.destination) {
			var ordersArr = [];
			for (let i = 0; i < $scope.currentOrders.length; ++i)
				if ($scope.currentOrders[i].firstCountry == $scope.searchCriteria.destination ||
					$scope.currentOrders[i].secondCountry == $scope.searchCriteria.destination ||
					$scope.currentOrders[i].thirdCountry == $scope.searchCriteria.destination) ordersArr.push($scope.currentOrders[i]);
			$scope.currentOrders = ordersArr;
		} else delete $scope.searchCriteria.destination;

		if ($scope.searchCriteria.itinerary) {
			var ordersArr = [];
			for (let i = 0; i < $scope.currentOrders.length; ++i)
				if ($scope.currentOrders[i].itineraryId == $scope.searchCriteria.itinerary) ordersArr.push($scope.currentOrders[i]);
			$scope.currentOrders = ordersArr;
		} else delete $scope.searchCriteria.itinerary;

		if ($scope.searchCriteria.travelPurpose) {
			var ordersArr = [];
			for (let i = 0; i < $scope.currentOrders.length; ++i)
				if ($scope.currentOrders[i].travelPurpose == $scope.searchCriteria.travelPurpose) ordersArr.push($scope.currentOrders[i]);
			$scope.currentOrders = ordersArr;
		} else delete $scope.searchCriteria.travelPurpose;

		if ($scope.searchCriteria.budgetCategory) {
			var ordersArr = [];
			for (let i = 0; i < $scope.currentOrders.length; ++i)
				if ($scope.currentOrders[i].budgetCategory == $scope.searchCriteria.budgetCategory) ordersArr.push($scope.currentOrders[i]);
			$scope.currentOrders = ordersArr;
		} else delete $scope.searchCriteria.budgetCategory;

		if ($scope.searchCriteria.edit) {
			var ordersArr = [];
			for (let i = 0; i < $scope.currentOrders.length; ++i)
				if ($scope.currentOrders[i].edit == $scope.searchCriteria.edit) ordersArr.push($scope.currentOrders[i]);
			$scope.currentOrders = ordersArr;
		} else delete $scope.searchCriteria.edit;

		if ($scope.searchCriteria.reachable) {
			var ordersArr = [];
			for (let i = 0; i < $scope.currentOrders.length; ++i)
				if ($scope.currentOrders[i].reachable == $scope.searchCriteria.reachable) ordersArr.push($scope.currentOrders[i]);
			$scope.currentOrders = ordersArr;
		} else delete $scope.searchCriteria.reachable;

		if ($scope.searchCriteria.packageSent) {
			var ordersArr = [];
			for (let i = 0; i < $scope.currentOrders.length; ++i)
				if ($scope.currentOrders[i].packageSent == $scope.searchCriteria.packageSent) ordersArr.push($scope.currentOrders[i]);
			$scope.currentOrders = ordersArr;
		} else delete $scope.searchCriteria.packageSent;

		if ($scope.searchCriteria.referralType) {
			var ordersArr = [];
			for (let i = 0; i < $scope.currentOrders.length; ++i)
				if ($scope.currentOrders[i].referralType == $scope.searchCriteria.referralType) ordersArr.push($scope.currentOrders[i]);
			$scope.currentOrders = ordersArr;
		} else delete $scope.searchCriteria.referralType;

		if ($scope.searchCriteria.estimatedFrom) {
			var ordersArr = [];
			for (let i = 0; i < $scope.currentOrders.length; ++i)
				if ($scope.currentOrders[i].estimatedCost >= $scope.searchCriteria.estimatedFrom) ordersArr.push($scope.currentOrders[i]);
			$scope.currentOrders = ordersArr;
		} else delete $scope.searchCriteria.estimatedFrom;

		if ($scope.searchCriteria.estimatedTo) {
			var ordersArr = [];
			for (let i = 0; i < $scope.currentOrders.length; ++i)
				if ($scope.currentOrders[i].estimatedCost <= $scope.searchCriteria.estimatedTo) ordersArr.push($scope.currentOrders[i]);
			$scope.currentOrders = ordersArr;
		} else delete $scope.searchCriteria.estimatedTo;

		$scope.refreshContent();
	};
	$scope.markOrderDelivered = function (order) {
		$scope.markingOrder = true;
		$http.post($rootScope.serverURL + "/request/status/delivered", {
			requestId: order.id
		}).success(
			function () {
				order.status = 'Completed';
				$scope.markingOrder = false;
				$scope.refreshContent();
			}
		).error(function (err) {
			$scope.markingOrder = false;
		});
	};

	$scope.markOrderPlaced = function (order) {
		$scope.markingOrder = true;
		$http.post($rootScope.serverURL + "/request/status/placed", {
			requestId: order.id
		}).success(
			function () {
				order.status = 'New';
				$scope.markingOrder = false;
				$scope.refreshContent();
			}
		).error(function (err) {
			$scope.markingOrder = false;
		});
	};
	$scope.markOrderBeingPrepared = function (order) {
		$scope.markingOrder = true;
		$http.post($rootScope.serverURL + "/request/status/beingprepared", {
			requestId: order.id
		}).success(
			function () {
				order.status = 'In Progress';
				$scope.markingOrder = false;
				$scope.refreshContent();
			}
		).error(function (err) {
			$scope.markingOrder = false;
		});
	};

	$scope.refreshContent = function () {
		for (var i = 0; i < $scope.statuses.length; ++i) $scope.refreshOrdersCount($scope.statuses[i].id);
	};
	$scope.openFullDetailsDialog = function (requestId) {
		$scope.loading = true;
		$scope.serverError = false;
		$('#orderDetailsModal').modal('show');
		$http.get($rootScope.serverURL + "/request/" + requestId).success(
			function (request) {
				$scope.loading = false;
				if (request.date) request.date = new Date(request.date);
				if (request.traveler) request.traveler.dateOfBirth = new Date(request.traveler.dateOfBirth);
				if (request.departureDate) request.departureDate = new Date(request.departureDate);
				if (request.returnDate) request.returnDate = new Date(request.returnDate);
				for (let i = 0; i < request.mailsHistory.length; i++) request.mailsHistory[i].date = new Date(request.mailsHistory[i].date);
				$scope.currentOrder = request;
			}
		).error(function (err) {
			$scope.serverError = true;
			$scope.serverErrorMessage = err;
			$scope.loading = false;
		});
	};

	$scope.updateOrder = function () {
		$scope.loading = true;
		$scope.serverError = false;
		$http.put($rootScope.serverURL + "/request", {
			request: $scope.currentOrder
		}).success(
			function () {
				$scope.loading = false;
				$('#orderDetailsModal').modal('hide');
			}
		).error(function (err) {
			$scope.serverError = true;
			$scope.serverErrorMessage = err;
			$scope.loading = false;
		});
	};

	$scope.assignRequestToUser = function () {
		var selectedUserId = $scope.selectedUser.id;
		var selectedUserFullName = $scope.selectedUser.fullName;
		var currentRequestId = $scope.currentOrder.id;

		$scope.loading = true;
		$scope.serverError = false;
		$http.post($rootScope.serverURL + "/request/assign", {
			requestId: currentRequestId,
			userId: selectedUserId
		}).success(
			function () {
				$scope.loading = false;
				$scope.currentOrder.userFullName = selectedUserFullName;
				$('#assignUserModal').modal('hide');
			}
		).error(function (err) {
			$scope.serverError = true;
			$scope.serverErrorMessage = err;
			$scope.loading = false;
		});
	};

	$scope.toggleOptions = function (id, option) {
		$scope.loading = true;
		$scope.serverError = false;
		$http.put($rootScope.serverURL + "/request/toggleoptions", {
			requestId: id,
			option: option
		}).success(function (response) {
			$scope.loading = false;
			$scope.serverError = false;
			for (let i = 0; i < $scope.currentOrders.length; i++) {
				if ($scope.currentOrders[i].id === id && response.affectedRows >= 1) {
					$scope.currentOrders[i][option] = !$scope.currentOrders[i][option];
				}
			}
		}).error(function (err) {
			$scope.serverError = true;
			$scope.serverErrorMessage = err;
			$scope.loading = false;
		});
	}

	$scope.openAssignRequestToUser = function (request) {
		$scope.currentOrder = request;
		$('#assignUserModal').modal('show');
	};

	$scope.generatePackage = () => {
		$scope.loading = true;
		$http.get($rootScope.serverURL + "/request/package/" + $scope.currentOrder.id).success(function (response) {
			if (response) {
				$scope.serverError = false;
				$scope.currentOrder.generatedFile = response;
				// $window.open(response, "popup");
			} else {
				$scope.serverError = true;
				$scope.serverErrorMessage = err;
			}
			$scope.loading = false;
		}).error(function (err) {
			$scope.serverError = true;
			$scope.serverErrorMessage = err;
			$scope.loading = false;
		});
	}

	// initialize the date range picker
	// var format = 'MM/DD/YYYY h:mm A';
	// var from = moment().subtract('days', 30);
	// var to = moment();
	// $('#placedTime')[0].value = from.format(format) + " - " + to.format(format);
	// $('#placedTime').daterangepicker({
	// 	timePicker: true, timePickerIncrement: 30, format: format, startDate: from.format(format),
	// 	endDate: to.format(format)
	// }, function (start, end) {
	// 	$scope.searchCriteria.placedAtRange.from = start.toDate();
	// 	$scope.searchCriteria.placedAtRange.to = end.toDate();
	// });
	// $scope.searchCriteria.placedAtRange.from = from.toDate();
	// $scope.searchCriteria.placedAtRange.to = to.toDate();

	// refresh the numbers every 30 seconds
	$scope.getAllUsersToAssign();
	$scope.total.statusIds = [];
	for (var i = 0; i < $scope.statuses.length; ++i) $scope.total.statusIds.push($scope.statuses[i].id); // initialize by loading the 'New' orders
	window.setInterval($scope.refreshContent, 30000); // set the timer
	window.setInterval($scope.refreshLocations, 5000); // set the timer

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

	ItinerariesService.getAll().then(function (itineraries) {
		$scope.itineraries = itineraries;
	});

	ReferralTypesService.getAll().then(function (referralTypes) {
		$scope.referralTypes = referralTypes;
	});

	StatusesService.getAll().then(function (statuses) {
		for (let i = 0; i < statuses.length; ++i) {
			statuses[i].count = 0;
			statuses[i].revenue = 0;
			statuses[i].profit = 0;
			statuses[i].numberOfTravelers = 0;
			if (i + 1 === statuses.length) {
				$scope.statuses = statuses;
				$scope.refreshContent();
			}
		}
	});

	$scope.refreshOrders($scope.currentRequest);
}]);

g2gControlCenterApplication.directive('exportExcel', function () {
	return {
		restrict: 'AE',
		scope: {
			data: '=',
			filename: '=?',
			reportFields: '=',
			countries: '=',
			budgetCategories: '=',
			purposes: '=',
			interests: '='
		},
		link: function (scope, element) {
			scope.filename = !!scope.filename ? scope.filename : 'export-excel';

			var fields = [];
			var header = [];

			angular.forEach(scope.reportFields, function (field, key) {
				if (!field || !key) {
					throw new Error('error json report fields');
				}

				fields.push(key);
				header.push(field);
			});

			element.bind('click', function () {
				var bodyData = _bodyData();
				var strData = _convertToExcel(bodyData);

				var blob = new Blob([strData], {
					type: "text/plain;charset=utf-8"
				});

				return saveAs(blob, [scope.filename + '.xls']);
			});

			function _bodyData() {
				var data = scope.data.map(request => {
					request.firstCountryName = request.firstCountry && scope.countries ? scope.countries.find(country => country.id === request.firstCountry).en_name : '';
					request.secondCountryName = request.secondCountry && scope.countries ? scope.countries.find(country => country.id === request.secondCountry).en_name : '';
					request.thirdCountryName = request.thirdCountry && scope.countries ? scope.countries.find(country => country.id === request.thirdCountry).en_name : '';
					request.budgetCategoryName = request.budgetCategory && scope.budgetCategories ? scope.budgetCategories.find(country => country.id === request.budgetCategory).en_name : '';
					request.travelPurposeName = request.travelPurpose && scope.purposes ? scope.purposes.find(country => country.id === request.travelPurpose).en_name : '';
					request.isVisaAssistanceNeeded = request.visaAssistanceNeeded === 1 ? 'True' : 'False';
					request.isTourGuideNeeded = request.tourGuideNeeded === 1 ? 'True' : 'False';
					request.interests = scope.interests ? request.interests.map(interest => {
						interest.name = scope.interests.find(i => i.id === interest.id).en_name;
						return interest;
					}) : [];
					return request
				});
				var body = "";
				angular.forEach(data, function (dataItem) {
					var rowItems = [];

					angular.forEach(fields, function (field) {
						if (field.indexOf('.')) {
							field = field.split(".");
							var curItem = dataItem;

							// deep access to obect property
							angular.forEach(field, function (prop) {
								if (curItem !== null && curItem !== undefined) {
									curItem = curItem[prop];
								}
							});

							data = curItem;
						} else {
							data = dataItem[field];
						}

						var fieldValue = data !== null ? data : ' ';

						if (fieldValue !== undefined && angular.isObject(fieldValue)) {
							fieldValue = _objectToString(fieldValue);
						}

						if (fieldValue !== undefined) {
							fieldValue = fieldValue.toString().replace(/,/g, " ");
							fieldValue = fieldValue.toString().replace(/\n/g, " ");
						}

						rowItems.push(fieldValue);
					});

					body += rowItems.toString() + '\n';
				});

				return body;
			}

			function _convertToExcel(body) {
				return header + '\n' + body;
			}

			function _objectToString(object) {
				var output = '';
				angular.forEach(object, function (value, key) {
					output += key + ':' + value + ' ';
				});

				return '"' + output + '"';
			}
		}
	};
});