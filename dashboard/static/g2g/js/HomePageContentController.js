/**
 * 
 */

g2gControlCenterApplication.controller("HomePageContentController", ['$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location) {
	// fields
    $scope.newOrdersCount = 0;
    $scope.inProgressOrdersCount = 0;
    $scope.completedOrdersCount = 0;
    $scope.currentOrders = [];
    $scope.statuses = [{id: "New", name: "New"},  {id: "In Progress", name: "In Progress"}, {id: "Completed", name:"Completed"}];
    $scope.refreshingNewOrdersCount = false;
    $scope.refreshingCompletedOrdersCount = false;
    $scope.refreshingInProgressOrdersCount = false;
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
			placedAtRange: {from: null, to: null},
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
	$scope.refreshNewOrdersCount = function() {
		$scope.refreshingNewOrdersCount = true;
		$http.get($rootScope.serverURL + "/request/status/placed/count").success(
			function(response) {
				$scope.newOrdersCount = response.count;
				$scope.refreshingNewOrdersCount = false;
			}
		).error(function(err){
			$scope.newOrdersCount = "N/A";
			$scope.refreshingNewOrdersCount = false;
		});
	};
	$scope.refreshInProgressOrdersCount = function() {
		$scope.refreshingInProgressOrdersCount = true;
		$http.get($rootScope.serverURL + "/request/status/inprogress/count").success(
			function(response) {
				$scope.inProgressOrdersCount = response.count;
				$scope.refreshingInProgressOrdersCount = false;
			}
		).error(function(err){
			$scope.inProgressOrdersCount = "N/A";
			$scope.refreshingInProgressOrdersCount = false;
		});
	};
	$scope.refreshCompletedOrdersCount = function() {
		$scope.refreshingCompletedOrdersCount = true;
		$http.get($rootScope.serverURL + "/request/status/delivered/count").success(
			function(response) {
				$scope.completedOrdersCount = response.count;
				$scope.refreshingCompletedOrdersCount = false;
			}
		).error(function(err){
			$scope.completedOrdersCount = "N/A";
			$scope.refreshingCompletedOrdersCount = false;
		});
	};
	$scope.refreshRegisteredUsersCount = function() {
		$scope.refreshingRegisteredUsersCount = true;
		$http.get($rootScope.serverURL + "/user/users/count").success(
			function(response) {
				$scope.registeredUsersCount = response.registeredUsersIds;
				$scope.refreshingRegisteredUsersCount = false;
			}
		).error(function(err){
			$scope.registeredUsersCount = "N/A";
			$scope.refreshingRegisteredUsersCount = false;
		});
	};
	$scope.collapseAdvancedSearchIfExpanded = function() {
		var advancedSearchBoxExpanded = $('#collapseExpandIcon').hasClass('fa-minus');
		if (advancedSearchBoxExpanded) {
			$('#collapseExpandBtn').trigger('click');
		}
	};
	$scope.getAllUsers = function() {
		$http.get($rootScope.serverURL + "/users").success(
				function(response) {
					$scope.users = response;
				}
		).error(function(err){
			$scope.users = [];
		});
	};
	$scope.refreshNewOrders = function() {
		$scope.refreshingOrders = true;
		$scope.collapseAdvancedSearchIfExpanded();
		$http.get($rootScope.serverURL + "/request/status/placed").success(
				function(response) {
					$scope.currentOrders = response;
					$scope.refreshingOrders = false;
				}
		).error(function(err){
			$scope.currentOrders = [];
			$scope.refreshingOrders = false;
		});
	};
	$scope.refreshInProgressOrders = function() {
		$scope.collapseAdvancedSearchIfExpanded();
		$scope.refreshingOrders = true;
		$http.get($rootScope.serverURL + "/request/status/inprogress").success(
				function(response) {
					$scope.currentOrders = response;
					$scope.refreshingOrders = false;
				}
		).error(function(err){
			$scope.currentOrders = [];
			$scope.refreshingOrders = false;
		});
	};
	$scope.refreshCompletedOrders = function() {
		$scope.collapseAdvancedSearchIfExpanded();
		$scope.refreshingOrders = true;
		$http.get($rootScope.serverURL + "/request/status/delivered").success(
				function(response) {
					$scope.currentOrders = response;
					$scope.refreshingOrders = false;
				}
		).error(function(err){
			$scope.currentOrders = [];
			$scope.refreshingOrders = false;
		});
	};
	$scope.searchOrders = function() {
		$scope.refreshingOrders = true;
		$http.post($rootScope.serverURL + "/requests/search", {searchCriteria: $scope.searchCriteria}).success(
				function(response) {
					$scope.currentOrders = response;
					$scope.refreshingOrders = false;
				}
		).error(function(err){
			$scope.currentOrders = [];
			$scope.refreshingOrders = false;
		});
	};
	$scope.searchOrdersAndExport = function() {
		$scope.refreshingOrders = true;
		$http.post($rootScope.serverURL + "/requests/search", {searchCriteria: $scope.searchCriteria}).success(
				function(response) {
					$scope.currentOrders = response;
					$scope.refreshingOrders = false;
					window.location = $rootScope.serverURL + "/orders/searchAndExport" + "?searchCriteria=" + JSON.stringify($scope.searchCriteria);
				}
		).error(function(err){
			$scope.currentOrders = [];
			$scope.refreshingOrders = false;
		});
	};
	$scope.markOrderDelivered = function(order) {
		$scope.markingOrder = true;
		$http.post($rootScope.serverURL + "/request/status/delivered", {requestId: order.id}).success(
			function() {
				order.status = 'Completed';
				$scope.markingOrder = false;
				$scope.refreshContent();
			}
		).error(function(err) {
			$scope.markingOrder = false;
		});
	};
	
	$scope.markOrderPlaced = function(order) {
		$scope.markingOrder = true;
		$http.post($rootScope.serverURL + "/request/status/placed", {requestId: order.id}).success(
			function() {
				order.status = 'New';
				$scope.markingOrder = false;
				$scope.refreshContent();
			}
		).error(function(err) {
			$scope.markingOrder = false;
		});
	};
	$scope.markOrderBeingPrepared = function(order) {
		$scope.markingOrder = true;
		$http.post($rootScope.serverURL + "/request/status/beingprepared", {requestId: order.id}).success(
			function() {
				order.status = 'In Progress';
				$scope.markingOrder = false;
				$scope.refreshContent();
			}
		).error(function(err) {
			$scope.markingOrder = false;
		});
	};
	
	$scope.refreshContent = function() {
		$scope.refreshNewOrdersCount();
		$scope.refreshInProgressOrdersCount();
		$scope.refreshCompletedOrdersCount();
		$scope.refreshRegisteredUsersCount();
	};
	$scope.openFullDetailsDialog = function(requestId) {
		$scope.loading = true;
		$scope.serverError = false;
		$('#orderDetailsModal').modal('show');
		$http.get($rootScope.serverURL + "/request/" + requestId).success(
			function(response) {
				$scope.loading = false;
				$scope.currentOrder = response;
			}
			).error(function(err) {
				$scope.serverError = true;
				$scope.serverErrorMessage = err;
				$scope.loading = false;
			});
	};
	
	$scope.saveCommentToOrder = function(requestId) {
		$scope.loading = true;
		$scope.serverError = false;
		$http.put($rootScope.serverURL + "/request/comment", {requestId: requestId, comment: $scope.currentOrder.comments}).success(
			function() {
				$scope.loading = false;
				$('#orderDetailsModal').modal('hide');
			}
		).error(function(err) {
			$scope.serverError = true;
			$scope.serverErrorMessage = err;
			$scope.loading = false;
		});
	};
	
	$scope.assignRequestToUser = function() {
		var selectedUserId = $scope.selectedUser.id;
		var selectedUserFullName = $scope.selectedUser.fullName;
		var currentRequestId = $scope.currentOrder.id;
		
		$scope.loading = true;
		$scope.serverError = false;
		$http.post($rootScope.serverURL + "/request/assign", {requestId: currentRequestId, userId: selectedUserId}).success(
			function() {
				$scope.loading = false;
				$scope.currentOrder.userFullName = selectedUserFullName;
				$('#assignUserModal').modal('hide');
			}
		).error(function(err) {
			$scope.serverError = true;
			$scope.serverErrorMessage = err;
			$scope.loading = false;
		});
	};
	
	$scope.openAssignRequestToUser = function(request) {
		$scope.currentOrder = request;
		$('#assignUserModal').modal('show');
	};
	
	// initialize the date range picker
	var format = 'MM/DD/YYYY h:mm A';
	var from = moment().subtract('days', 30);
	var to = moment();
	$('#placedTime')[0].value = from.format(format) + " - " + to.format(format);
	$('#placedTime').daterangepicker({timePicker: true, timePickerIncrement: 30, format: format,startDate: from.format(format),
        endDate: to.format(format)},function (start, end) {
      $scope.searchCriteria.placedAtRange.from = start.toDate();
      $scope.searchCriteria.placedAtRange.to = end.toDate();
    });
	$scope.searchCriteria.placedAtRange.from = from.toDate();
    $scope.searchCriteria.placedAtRange.to = to.toDate();
	
	// refresh the numbers every 30 seconds
	$scope.refreshContent(); // refresh once
	$scope.getAllUsers();
	$scope.refreshNewOrders();
	window.setInterval($scope.refreshContent, 30000); // set the timer
	window.setInterval($scope.refreshLocations, 5000); // set the timer
}]);