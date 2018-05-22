/**
 * 
 */

tripdizerApplication.controller("GroupTripsController", ['$rootScope', '$scope', '$http', '$location', '$sce', 'VideosService', 'GroupTripsService', function ($rootScope, $scope, $http, $location, $sce, VideosService, GroupTripsService) {

    $scope.videos = [];
    $scope.groupTrips = [];

    VideosService.getAll().then(function (videos) {
        for (let i = 0; i < videos.length; i++) {
            videos[i].uri = $sce.trustAsResourceUrl(videos[i].uri);
            $scope.videos.push(videos[i]);
        }
    });

    GroupTripsService.getAll().then(function (groupTrips) {
        $scope.groupTrips = groupTrips;
    });
}]);