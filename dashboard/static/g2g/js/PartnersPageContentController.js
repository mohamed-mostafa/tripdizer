/**
 * 
 */

g2gControlCenterApplication.controller("PartnersPageContentController", ['$rootScope', '$scope', '$http', '$location', function($rootScope, $scope, $http, $location) {
	// fields
	$scope.partners = [];
	
	// validation flags
	$scope.nameMissing = false;
	$scope.emailMissing = false;
	$scope.serverError = false;
	$scope.serverErrorMessage = "";
	// form fields
	$scope.newPartner = {active: true};
	$scope.editMode = false;
	
	$scope.loading = false;
	$scope.saving = false;
	$scope.currentId = 0;
	
    // functions
	$scope.resetValidationFlags = function() {
		$scope.nameMissing = false;
		$scope.emailMissing = false;
		$scope.serverError = false;
		$scope.serverErrorMessage = "";
	};
	$scope.newPartnerIsValid = function() {
		$scope.resetValidationFlags();
		if ($scope.newPartner.name == null || $scope.newPartner.name == "") {
			$scope.nameMissing = true;
		}
		if ($scope.newPartner.email == null || $scope.newPartner.email == "") {
			$scope.emailMissing = true;
		}
		return $scope.nameMissing == false &&
			$scope.emailMissing == false;
	};
	$scope.loadPartners = function() {
		$scope.loading = true;
		$http.get($rootScope.serverURL + "/partners")
		.success(
				function(response) {
					$scope.partners = response;
					$scope.loading = false;
				})
		.error(function(err){
			$scope.partners = [];
			$scope.loading = false;
		});
	};
	$scope.addPartner = function(close) {
		if ($scope.newPartnerIsValid()) {
			$scope.saving = true;
			$http.put($rootScope.serverURL + "/partner", {partner: $scope.newPartner}
			).success(
					function(response) {
						$scope.saving = false;
						$scope.newPartner = {active: true};
						$scope.partners.push(response);
						if (close) {
							$('#addPartnerModal').modal('hide');
						}
					}
			).error(function(err){
				$scope.saving = false;
				$scope.serverError = true;
				$scope.serverErrorMessage = "An error occured at the server side: " + err;
			});
		}
	};
	$scope.editPartner = function(id) {
		$scope.resetValidationFlags();
		if ($scope.newPartnerIsValid()) {
			$scope.saving = true;
			$http.post($rootScope.serverURL + "/partner", {partner: $scope.newPartner}
			).success(
					function(response) {
						for (var i = 0; i < $scope.partners.length; i++) {
							if ($scope.partners[i].id == $scope.newPartner.id) {
								$scope.partners[i] = $scope.newPartner;
								break;
							}
						}
						$scope.saving = false;
						$scope.editMode = false;
						$scope.newPartner = {active: true};
						$('#addPartnerModal').modal('hide');
					}
			).error(function(err){
				$scope.newPartner = {};
				$scope.editMode = false;
				$scope.saving = false;
				$scope.serverError = true;
				$scope.serverErrorMessage = "An error occured at the server side: " + err;
			});
		}
	};
	$scope.toggleActivation = function(id) {
		// find the clicked item
		$scope.currentId = id;
		for (var i = 0; i < $scope.partners.length; i++) {
			if ($scope.partners[i].id == id) {
				$scope.newPartner = $scope.partners[i];
				break;
			}
		}
		// toggle its active attribute
		$scope.newPartner.active = !$scope.newPartner.active;
		// call the edit function
		$scope.editPartner(id);
	};
	$scope.openEditDialog = function (id) {
		$scope.editMode = true;
		for (var i = 0; i < $scope.partners.length; i++) {
			if ($scope.partners[i].id == id) {
				$scope.newPartner = $scope.partners[i];
			}
		}
		$('#addPartnerModal').modal('show');
	};
	$scope.openAddDialog = function (id) {
		$scope.editMode = false;
		$('#addPartnerModal').modal('show');
	};
	$scope.buildTable = function() {
		// initialize the table
	      $(function () {
	        $('#partnersTable').dataTable({
	          "bPaginate": true,
	          "bLengthChange": false,
	          "bFilter": false,
	          "bSort": true,
	          "bInfo": true,
	          "bAutoWidth": false
	        });
	      });
	};
	$scope.initialize = function() {
		$scope.loadPartners();
	};
	
	$scope.initialize();
}]);