/**
 * 
 */

tripdizerApplication.controller("GroupTripsController", ['$rootScope', '$scope', '$http', '$location', '$sce', 'VideosService', function ($rootScope, $scope, $http, $location, $sce, VideosService) {

    $scope.videos = [];

    VideosService.getAll().then(function (videos) {
        for (let i = 0; i < videos.length; i++) {
            videos[i].uri = $sce.trustAsResourceUrl(videos[i].uri);
            $scope.videos.push(videos[i]);
        }
    });
}]);