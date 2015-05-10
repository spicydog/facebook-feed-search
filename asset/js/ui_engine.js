var storySearchApp = angular.module('StorySearch', ['ngMaterial']);

storySearchApp.controller('AppCtrl', function($scope) {

    storySearchApp.scope = $scope;

    $scope.requestButton = 'Request';

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
        $scope.updateRequestSummary();
    };

    $scope.updateRequestSummary = function() {

        console.log('x' + globalDocuments.length);
        $scope.requestCount = globalDocuments.length;

        if(isRequesting) {
            $scope.requestButton = 'Stop';
        } else {
            $scope.requestButton ='Request';
        }
    };

    $scope.updateRequestSummary();
});

