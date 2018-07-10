/**
 * 
 */

g2gControlCenterApplication.controller("VideosController", ['$rootScope', '$scope', '$http', 'VideosService', function ($rootScope, $scope, $http, VideosService) {
	// fields
	$scope.videos = [];

	// validation flags
	$scope.serverError = false;
	$scope.serverErrorMessage = "";
	// form fields
	$scope.newVideo = {};
	$scope.editMode = false;

	$scope.loading = false;
	$scope.saving = false;

	// functions
	$scope.resetValidationFlags = function () {
		$scope.en_nameMissing = false;
		$scope.ar_nameMissing = false;
		$scope.en_descriptionMissing = false;
		$scope.ar_descriptionMissing = false;
		$scope.uriMissing = false;
		$scope.serverError = false;
		$scope.serverErrorMessage = "";
	};
	$scope.newVideoIsValid = function () {
		$scope.resetValidationFlags();
		if ($scope.newVideo.en_name == null || $scope.newVideo.en_name == "") {
			$scope.en_nameMissing = true;
		}
		if ($scope.newVideo.ar_name == null || $scope.newVideo.ar_name == "") {
			$scope.ar_nameMissing = true;
		}
		if ($scope.newVideo.en_description == null || $scope.newVideo.en_description == "") {
			$scope.en_descriptionMissing = true;
		}
		if ($scope.newVideo.ar_description == null || $scope.newVideo.ar_description == "") {
			$scope.ar_descriptionMissing = true;
		}
		if ($scope.newVideo.uri == null || $scope.newVideo.uri == "") {
			$scope.uriMissing = true;
		}
		return $scope.en_nameMissing !== true && $scope.ar_nameMissing !== true &&
			$scope.en_descriptionMissing !== true && $scope.ar_descriptionMissing !== true &&
			$scope.uriMissing !== true
	};
	$scope.addVideo = function (close) {
		if ($scope.newVideoIsValid()) {
			$scope.saving = true;
			$http.post($rootScope.serverURL + "/public/video", {
				video: $scope.newVideo
			}).success(
				function (response) {
					$scope.saving = false;
					$scope.videos.push(response);
					if (close) {
						$('#addVideoModal').modal('hide');
					}
					$scope.newVideo = {};
				}
			).error(function (err) {
				$scope.saving = false;
				$scope.serverError = true;
				$scope.serverErrorMessage = "An error occured at the server side: " + err;
			});
		}
	};
	$scope.editVideo = function (id) {
		$scope.resetValidationFlags();
		if ($scope.newVideoIsValid()) {
			$scope.saving = true;
			$http.put($rootScope.serverURL + "/public/video", {
				video: $scope.newVideo
			}).success(
				function (response) {
					for (var i = 0; i < $scope.videos.length; i++) {
						if ($scope.videos[i].id == response.id) {
							$scope.videos[i] = response;
							break;
						}
					}
					$scope.saving = false;
					$scope.editMode = false;
					$('#addVideoModal').modal('hide');
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
		$scope.newVideo = {};
		$scope.editMode = false;
		$('#addVideoModal').modal('show');
	};
	$scope.openEditDialog = function (id) {
		$scope.newVideo = $scope.videos.find(v => v.id === id);
		$scope.editMode = true;
		$('#addVideoModal').modal('show');
	};
	$scope.buildTable = function () {
		// initialize the table
		$(function () {
			$('#videosTable').dataTable({
				"bPaginate": true,
				"bLengthChange": false,
				"bFilter": false,
				"bSort": true,
				"bInfo": true,
				"bAutoWidth": false
			});
		});
	};
	$scope.initialize = function () {
		VideosService.getAll().then(function (videos) {
			$scope.videos = videos;
		});
	};

	$scope.initialize();
}]);