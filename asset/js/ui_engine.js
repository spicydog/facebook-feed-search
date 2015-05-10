var storySearchApp = angular.module('StorySearch', ['ngMaterial']);

storySearchApp.config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
    });


storySearchApp.controller('AppCtrl', function($scope) {

    storySearchApp.scope = $scope;

    $scope.isLoggedIn = false;

    $scope.requestButton = 'Request';

    $scope.isSearch = false;
    $scope.keyword = '';

    $scope.searchResult = {};
    $scope.searchResult.keyword = '';
    $scope.searchResult.number = 0;

    $scope.refreshSearch = function() {
        $scope.clickSearch($scope.keyword);
    };

    $scope.clickSearch = function(keyword) {

        if(keyword.length>0) {

            $scope.keyword = keyword;
            $scope.$applyAsync(function() {
                var documents = search(keyword);
                var feedResults = [];
                var count = 0;
                for(i in documents) {
                    var document = documents[i];
                    var feedData = getFeedData(document.id);
                    feedData.score = document.score;
                    feedResults.push(feedData);

                    if(++count>50) {
                        break;
                    }
                }
                $scope.feedResults = feedResults;
                $scope.isSearch = true;

                $scope.searchResult.keyword = keyword;
                $scope.searchResult.number = documents.length;
            });


        }

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

    $scope.updateRequestSummary = function() {

        $scope.requestCount = globalDocuments.length;

        if(isRequesting) {
            $scope.requestButton = 'Stop';
        } else {
            $scope.requestButton ='Request';
        }

        $scope.refreshSearch();
    };
    $scope.updateRequestSummary();
});

storySearchApp.directive('ngEnter', function () {
    // From: http://stackoverflow.com/a/17472118/967802
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

storySearchApp.directive('selectOnClick', function () {
    // From: http://stackoverflow.com/a/14996261/967802
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.on('click', function () {
                this.select();
            });
        }
    };
});