var storySearchApp = angular.module('StorySearch', ['ngMaterial']);


storySearchApp.config(function($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
    });


storySearchApp.controller('AppCtrl', function($scope) {

    storySearchApp.scope = $scope;

    $scope.defaultQuantity = 10;
    $scope.quantity = $scope.defaultQuantity;

    $scope.isLoggedIn = false;

    $scope.requestButton = 'Request';

    $scope.isSearch = false;
    $scope.keyword = '';

    $scope.order = $scope.isSearch ? '-score':'-timestamp';

    $scope.searchResult = {};
    $scope.searchResult.keyword = '';
    $scope.searchResult.number = 0;

    $scope.refreshSearch = function() {
        $scope.clickSearch($scope.keyword);
    };

    $scope.clickShowMore = function() {
        $scope.quantity += $scope.defaultQuantity;
    };

    $scope.clickSearch = function(keyword) {

        if($scope.keyword != keyword) {
            $scope.quantity = $scope.defaultQuantity;
        }
        $scope.keyword = keyword;

        if(keyword.length>0) {

            $scope.$applyAsync(function() {
                var documents = search(keyword);
                var feedResults = [];
                for(i in documents) {
                    var document = documents[i];
                    var feedData = getFeedData(document.id);
                    feedData.score = document.score;
                    feedResults.push(feedData);
                }
                $scope.feedResults = feedResults;
                $scope.isSearch = true;
                $scope.searchResult.keyword = keyword;
                $scope.searchResult.number = $scope.feedResults.length;

            });
        } else {
            $scope.feedResults = mFeedData;
            $scope.isSearch = false;
            $scope.searchResult.keyword = keyword;
            $scope.searchResult.number = $scope.feedResults.length;
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

        $scope.requestCount = documentList.length;

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


storySearchApp.directive("scrolledToBottom", function ($window) {
    var lastScrollHeight = document.body.scrollHeight;
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
            if(document.body.scrollHeight-document.body.scrollTop-document.documentElement.clientHeight < 300) {
                // At the end of the screen
                if(lastScrollHeight != document.body.scrollHeight) {
                    scope.clickShowMore();
                    lastScrollHeight = document.body.scrollHeight;
                }

            }

        });
    };
});