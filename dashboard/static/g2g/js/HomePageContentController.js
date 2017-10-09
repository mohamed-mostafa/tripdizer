/**
 * 
 */

g2gControlCenterApplication.controller("HomePageContentController", ['$rootScope', '$scope', '$http', '$location', function ($rootScope, $scope, $http, $location) {
	// fields
	$scope.statuses = [
		{
			title: 'New',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'gray',
			watermark: 'bell'
		},
		{
			title: 'Unreachable',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'danger',
			watermark: 'gear'
		},
		{
			title: 'Contacted',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'maroon-gradient',
			watermark: 'gear'
		},
		{
			title: 'Pending Send to Dizer',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'orange-active',
			watermark: 'gear'
		},
		{
			title: 'Pending Send to Agencies',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'orange',
			watermark: 'gear'
		},
		{
			title: 'Pending Send to Customer',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'yellow-active',
			watermark: 'gear'
		},
		{
			title: 'Pending Dizer Response',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'yellow',
			watermark: 'gear'
		},
		{
			title: 'Pending Agencies Response',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'yellow-gradient',
			watermark: 'gear'
		},
		{
			title: 'Sent to Customer',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'purple-gradient',
			watermark: 'gear'
		},
		{
			title: 'Not Serious',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'red-gradient',
			watermark: 'gear'
		},
		{
			title: 'Rejected',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'red',
			watermark: 'gear'
		},
		{
			title: 'Future Requests',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'blue-gradient',
			watermark: 'gear'
		},
		{
			title: 'Confirmed',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'blue',
			watermark: 'gear'
		},
		{
			title: 'Booked',
			count: 0,
			revenue: 0,
			profit: 0,
			refresh: false,
			color: 'green',
			watermark: 'checkmark'
		}
	];
	$scope.currentOrders = [];
	$scope.total = { title: '', count: 0, revenue: 0, profit: 0 };
	$scope.refreshingOrders = false;
	$scope.markingOrder = false;
	$scope.currentOrder = null;
	$scope.selectedUser = null;
	$scope.searchCriteria = {
		restaurant: null,
		driver: null,
		customerName: null,
		customerZipCode: null,
		customerCity: null,
		placedAtRange: { from: null, to: null },
		status: null,
		rating: null,
		onTime: false,
		excludeArchived: false,
	};
	$scope.users = [];
	$scope.loading = false;
	$scope.serverError = false;
	$scope.serverErrorMessage = "";

	// functions
	$scope.refreshOrdersCount = function (title) {
		var index = $scope.statuses.findIndex(state => state.title === title);
		$scope.statuses[index].refresh = true;
		$http.get($rootScope.serverURL + "/request/statuses/count?statuses=" + $scope.statuses[index].title).success(
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
		$scope.refreshingOrders = true;
		$scope.collapseAdvancedSearchIfExpanded();
		$http.get($rootScope.serverURL + "/request/statuses/summaries?statuses=" + request).success(
			function (response) {
				$scope.currentOrders = response;
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
		$scope.refreshingOrders = true;
		$http.post($rootScope.serverURL + "/requests/search", { searchCriteria: $scope.searchCriteria }).success(
			function (response) {
				$scope.currentOrders = response;
				$scope.refreshingOrders = false;
			}
		).error(function (err) {
			$scope.currentOrders = [];
			$scope.refreshingOrders = false;
		});
	};
	$scope.searchOrdersAndExport = function () {
		$scope.refreshingOrders = true;
		$http.post($rootScope.serverURL + "/requests/search", { searchCriteria: $scope.searchCriteria }).success(
			function (response) {
				$scope.currentOrders = response;
				$scope.refreshingOrders = false;
				window.location = $rootScope.serverURL + "/orders/searchAndExport" + "?searchCriteria=" + JSON.stringify($scope.searchCriteria);
			}
		).error(function (err) {
			$scope.currentOrders = [];
			$scope.refreshingOrders = false;
		});
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
		$scope.refreshRegisteredUsersCount();
	};
	$scope.openFullDetailsDialog = function (requestId) {
		$scope.loading = true;
		$scope.serverError = false;
		$('#orderDetailsModal').modal('show');
		$http.get($rootScope.serverURL + "/request/" + requestId).success(
			function (response) {
				$scope.loading = false;
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
	var format = 'MM/DD/YYYY h:mm A';
	var from = moment().subtract('days', 30);
	var to = moment();
	$('#placedTime')[0].value = from.format(format) + " - " + to.format(format);
	$('#placedTime').daterangepicker({
		timePicker: true, timePickerIncrement: 30, format: format, startDate: from.format(format),
		endDate: to.format(format)
	}, function (start, end) {
		$scope.searchCriteria.placedAtRange.from = start.toDate();
		$scope.searchCriteria.placedAtRange.to = end.toDate();
	});
	$scope.searchCriteria.placedAtRange.from = from.toDate();
	$scope.searchCriteria.placedAtRange.to = to.toDate();

	// refresh the numbers every 30 seconds
	$scope.refreshContent(); // refresh once
	$scope.getAllUsers();
	$scope.total.title = [];
	for (var i = 0; i < $scope.statuses.length; ++i) $scope.total.title.push($scope.statuses[i].title);
	$scope.refreshOrders($scope.total.title);
	window.setInterval($scope.refreshContent, 30000); // set the timer
	window.setInterval($scope.refreshLocations, 5000); // set the timer
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