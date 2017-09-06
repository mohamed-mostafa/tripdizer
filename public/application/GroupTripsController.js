/**
 * 
 */

tripdizerApplication.controller("GroupTripsController", ['$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location) {
	// fields
	$scope.selectedGroupTrip = "",
	$scope.currentDate = new Date(),
	
    // functions
	$scope.openSubmitGroupTripRequestDialog = function(destination) {
		
		$scope.selectedGroupTrip = destination;
		
		var today = new Date();
		$scope.currentDate = today.toISOString().substring(0, 10);
		
		$('#groupTripsRegistrationModal').modal('show');
	}
	
}]);