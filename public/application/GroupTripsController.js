/**
 * 
 */

tripdizerApplication.controller("GroupTripsController", ['$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location) {
	// fields
	$scope.selectedGroupTrip = "",
	$scope.currentDate = new Date(),
	$scope.tripFrom = "",
	$scope.tripTo = "",
	
    // functions
	$scope.openSubmitGroupTripRequestDialog = function(destination, from, to) {
		
		$scope.selectedGroupTrip = destination;
		$scope.tripFrom = from;
		$scope.tripTo = to;
		
		var today = new Date();
		$scope.currentDate = today.toISOString().substring(0, 10);
		
		$('#groupTripsRegistrationModal').modal('show');
	}
	
}]);