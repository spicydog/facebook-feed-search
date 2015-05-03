initSearchEngine();


var myApp = angular.module('JournalSearch', []);

myApp.controller('AppCtrl', function($scope) {

    $scope.feeds = mFeedData;

    $scope.clickRequest = function() {
        if(isRequesting) {
            isRequesting = false;
            requestMode = 0;
        } else {
            isRequesting = true;
            requestMode = 1;
            getData();
        }

    };

    var updateArray = function() {

        // Tokenizer for debugging
        angular.forEach(mFeedData,function(item){
            if(item.message) {
                item.message_t = tokenize(item.message).join('|');
            }

            if(item.description) {
                item.description_t = tokenize(item.description).join('|');
            }
        });

        $scope.feeds = mFeedData;
    };

    var timer = setInterval(function() {
        $scope.$apply(updateArray);
    }, 1000);

    updateArray();
});

