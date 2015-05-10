var myApp = angular.module('StorySearch', ['ngMaterial']);



myApp.controller('AppCtrl', function($scope) {

    $scope.requestCount = 0;

    $scope.clickSearch = function(keyword) {
        var documents = search(keyword);
        var feedResults = [];

        for(i in documents) {
            var document = documents[i];
            var feedData = getFeedData(document.id);
            feedData.score = document.score;
            feedResults.push(feedData);
        }
        $scope.feedResults = feedResults;
    };

    $scope.clickRequest = function() {
        if(isRequesting) {
            isRequesting = false;
            requestMode = 0;
        } else {
            isRequesting = true;
            requestMode = 1;
            requestFeeds();
        }
    };

    var updateArray = function() {
        $scope.requestCount = globalDocuments.length;
    };

    var timer = setInterval(function() {
        $scope.$apply(updateArray);
    }, 1000);

    updateArray();
});

