var myApp = angular.module('JournalSearch', []);

myApp.controller('AppCtrl', function($scope) {

    $scope.feeds = mFeedData;


    $scope.clickSearch = function(keyword) {
        var documents = search(keyword);

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
        $scope.feeds.count = globalDocuments.length;
        $scope.feeds = mFeedData;
    };

    var timer = setInterval(function() {
        $scope.$apply(updateArray);
    }, 1000);

    updateArray();
});

