/**
 * 
 */

g2gControlCenterApplication.controller("HomePageContentController", ['$rootScope', '$scope', '$http', '$location', 'CountriesService', 'PurposesService', 'BudgetCategoriesService', 'InterestsService', function ($rootScope, $scope, $http, $location, CountriesService, PurposesService, BudgetCategoriesService, InterestsService) {
	// fields
	$scope.statuses = [
		{
			title: 'New',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'red',
			watermark: 'bell',
			size: { xs: 4, lg: 4 },
			role: 0
		},
		{
			title: 'Group Trip',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'red',
			watermark: 'gear',
			size: { xs: 4, lg: 4 },
			role: 1
		},
		{
			title: 'Total',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'white',
			watermark: 'checkmark',
			size: { xs: 4, lg: 4 },
			role: 2
		},
		{
			title: 'Pending Send to Dizer',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'yellow',
			watermark: 'gear',
			size: { xs: 3, lg: 2 },
			role: 3
		},
		{
			title: 'Pending Send to Agencies',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'yellow',
			watermark: 'gear',
			size: { xs: 3, lg: 2 },
			role: 4
		},
		{
			title: 'Pending Send to Customer',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'yellow',
			watermark: 'gear',
			size: { xs: 3, lg: 2 },
			role: 5
		},
		{
			title: 'Pending Dizer Response',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'yellow',
			watermark: 'gear',
			size: { xs: 3, lg: 2 },
			role: 6
		},
		{
			title: 'Pending Agencies Response',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'yellow',
			watermark: 'gear',
			size: { xs: 3, lg: 2 },
			role: 7
		},
		{
			title: 'Sent to Customer',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'yellow',
			watermark: 'gear',
			size: { xs: 3, lg: 2 },
			role: 8
		},
		{
			title: 'Not Serious',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'gray-active',
			watermark: 'gray',
			size: { xs: 3, lg: 2 },
			role: 9
		},
		{
			title: 'Rejected',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'gray-active',
			watermark: 'gear',
			size: { xs: 3, lg: 2 },
			role: 10
		},
		{
			title: 'Unreachable',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'gray-active',
			watermark: 'gear',
			size: { xs: 3, lg: 2 },
			role: 11
		},
		{
			title: 'Future Requests',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'gray-active',
			watermark: 'purple',
			size: { xs: 3, lg: 2 },
			role: 12
		},
		{
			title: 'Confirmed',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'green-gradient',
			watermark: 'gear',
			size: { xs: 3, lg: 2 },
			role: 13
		},
		{
			title: 'Booked',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'green-active',
			watermark: 'checkmark',
			size: { xs: 3, lg: 2 },
			role: 14
		}
	];
	$scope.currentOrders = [];
	$scope.total = { title: '', count: 0, revenue: 0, profit: 0 };
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
	$scope.currentRequest = "New";

	// functions
	$scope.refreshOrdersCount = function (title) {
		var query = '';
		if (title == 'Total') {
			$scope.total.title = [];
			for (var i = 0; i < $scope.statuses.length; ++i) $scope.total.title.push($scope.statuses[i].title);
			query = $scope.total.title;
		} else {
			i = $scope.statuses.findIndex(state => state.title === title);
			query = $scope.statuses[i].title
		}
		var index = $scope.statuses.findIndex(state => state.title === title);
		$scope.statuses[index].refresh = true;
		$http.get($rootScope.serverURL + "/request/statuses/count?statuses=" + query + "&filter=" + JSON.stringify($scope.searchCriteria)).success(
			function (response) {
				if (!response.count) response.count = 0;
				if (!response.revenue) response.revenue = 0;
				if (!response.profit) response.profit = 0;
				$scope.statuses[index].count = response.count;
				$scope.statuses[index].revenue = response.revenue;
				$scope.statuses[index].profit = response.profit;
				$scope.statuses[index].refresh = false;
				$scope.calculateTotals();
			}
		).error(function (err) {
			$scope.statuses[index].count = "N/A";
			$scope.statuses[index].refresh = false;
		});
	};
	$scope.refreshOrders = function (request) {
		$scope.currentRequest = request;
		$scope.refreshingOrders = true;
		$scope.collapseAdvancedSearchIfExpanded();

		if (request === 'Total') {
			request = $scope.total.title;
		}

		$http.get($rootScope.serverURL + "/request/statuses/summaries?statuses=" + request).success(
			function (response) {
				response = response.map(function (request) {
					request.date = request.date.split('T')[0];
					request.departureDate = request.departureDate.split('T')[0];
					request.returnDate = request.returnDate.split('T')[0];
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
		$http.post($rootScope.serverURL + "/request/status", { requestId: order.id, status: order.status }).success(
			function () {
				$scope.markingOrder = false;
				$scope.refreshContent();
			}
		).error(function (err) {
			$scope.markingOrder = false;
		});
	};
	$scope.showMailModal = function (type, request) {
		$scope.email = { recipients: [], recipientsMissing: false, subjectMissing: false, bodyMissing: false, attachments: [], type: type };
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
			$http.post($rootScope.serverURL + "/request/statuses/sendmails", { email: $scope.email }).success(
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
		var total = { count: 0, revenue: 0, profit: 0 };
		for (var i = 0, statuses = $scope.statuses; i < statuses.length; ++i) {
			total.count += statuses[i].count;
			total.revenue += statuses[i].revenue;
			total.profit += statuses[i].profit;
		}
		$scope.total.count = total.count;
		$scope.total.revenue = total.revenue;
		$scope.total.profit = total.profit;
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
	$scope.getAllUsers = function () {
		$http.get($rootScope.serverURL + "/users").success(
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
			$scope.currentOrders = $scope.currentOrders.filter(function (request) {
				return request.traveler.name.toLowerCase().includes($scope.searchCriteria.name.toLowerCase());
			})
		} else delete $scope.searchCriteria.name;

		if ($scope.searchCriteria.from) {
			$scope.currentOrders = $scope.currentOrders.filter(function (request) {
				return new Date(request.date).getTime() > new Date($scope.searchCriteria.from).getTime();
			})
		} else delete $scope.searchCriteria.from;

		if ($scope.searchCriteria.to) {
			$scope.currentOrders = $scope.currentOrders.filter(function (request) {
				return new Date(request.date).getTime() <= new Date($scope.searchCriteria.to).getTime();
			})
		} else delete $scope.searchCriteria.to;

		if ($scope.searchCriteria.departureDate) {
			$scope.currentOrders = $scope.currentOrders.filter(function (request) {
				return new Date(request.date).getTime() === new Date($scope.searchCriteria.departureDate).getTime();
			})
		} else delete $scope.searchCriteria.departureDate;

		if ($scope.searchCriteria.returnDate) {
			$scope.currentOrders = $scope.currentOrders.filter(function (request) {
				return new Date(request.date).getTime() === new Date($scope.searchCriteria.returnDate).getTime();
			})
		} else delete $scope.searchCriteria.returnDate;

		if ($scope.searchCriteria.destination) {
			$scope.currentOrders = $scope.currentOrders.filter(function (request) {
				return request.firstCountry == $scope.searchCriteria.destination ||
					request.secondCountry == $scope.searchCriteria.destination ||
					request.thirdCountry == $scope.searchCriteria.destination
			})
		} else delete $scope.searchCriteria.destination;

		if ($scope.searchCriteria.status) {
			$scope.currentRequest = $scope.searchCriteria.status;
			$scope.currentOrders = $scope.currentOrders.filter(function (request) {
				return request.status === $scope.searchCriteria.status
			})
		} else delete $scope.searchCriteria.status;

		if ($scope.searchCriteria.travelPurpose) {
			$scope.currentOrders = $scope.currentOrders.filter(function (request) {
				return request.travelPurpose == $scope.searchCriteria.travelPurpose
			})
		} else delete $scope.searchCriteria.travelPurpose;

		if ($scope.searchCriteria.budgetCategory) {
			$scope.currentOrders = $scope.currentOrders.filter(function (request) {
				return request.budgetCategory == $scope.searchCriteria.budgetCategory
			})
		} else delete $scope.searchCriteria.budgetCategory;
		$scope.refreshContent();
	};
	$scope.markOrderDelivered = function (order) {
		$scope.markingOrder = true;
		$http.post($rootScope.serverURL + "/request/status/delivered", { requestId: order.id }).success(
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
		$http.post($rootScope.serverURL + "/request/status/placed", { requestId: order.id }).success(
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
		$http.post($rootScope.serverURL + "/request/status/beingprepared", { requestId: order.id }).success(
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
		for (var i = 0; i < $scope.statuses.length; ++i) $scope.refreshOrdersCount($scope.statuses[i].title);
		//		$scope.refreshRegisteredUsersCount();
	};
	$scope.openFullDetailsDialog = function (requestId) {
		$scope.loading = true;
		$scope.serverError = false;
		$('#orderDetailsModal').modal('show');
		$http.get($rootScope.serverURL + "/request/" + requestId).success(
			function (response) {
				$scope.loading = false;
				response.date = response.date.split('T')[0];
				response.departureDate = response.departureDate.split('T')[0];
				response.returnDate = response.returnDate.split('T')[0];
				$scope.currentOrder = response;
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
		$http.put($rootScope.serverURL + "/request", { request: $scope.currentOrder }).success(
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
		$http.post($rootScope.serverURL + "/request/assign", { requestId: currentRequestId, userId: selectedUserId }).success(
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

	$scope.openAssignRequestToUser = function (request) {
		$scope.currentOrder = request;
		$('#assignUserModal').modal('show');
	};

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
	$scope.refreshContent(); // refresh once
	$scope.getAllUsers();
	$scope.total.title = [];
	for (var i = 0; i < $scope.statuses.length; ++i) $scope.total.title.push($scope.statuses[i].title); // initialize by loading the 'New' orders
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

	$scope.refreshOrders($scope.currentRequest);
}]);

g2gControlCenterApplication.directive('ngFileModel', ['$parse', function ($parse) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var model = $parse(attrs.ngFileModel);
			var isMultiple = attrs.multiple;
			var modelSetter = model.assign;
			element.bind('change', function () {
				var values = [];
				angular.forEach(element[0].files, function (item) {
					var value = {
						filename: item.name,
						path: URL.createObjectURL(item),
						contentType: item.type,
						_file: item
					};
					values.push(value);
				});
				scope.$apply(function () {
					if (isMultiple) {
						modelSetter(scope, values);
					} else {
						modelSetter(scope, values[0]);
					}
				});
			});
		}
	};
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

				var blob = new Blob([strData], { type: "text/plain;charset=utf-8" });

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
						}
						else {
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