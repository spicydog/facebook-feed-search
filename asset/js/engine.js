var myApp = angular.module('JournalSearch', []);

var person1 = {title:"John1", content:"Doe1", age:46};
var person2 = {title:"John2", content:"Doe2", age:46};
var person3 = {title:"John3", content:"Doe3", age:46};


var xxx = [];
myApp.controller('AppCtrl', function($scope) {

    $scope.feeds = mFeedData;

    $scope.clickRequest = function() {
        getData(mAccessToken);
    };

    var updateArray = function() {
        $scope.feeds = mFeedData;
    };

    var timer = setInterval(function() {
        $scope.$apply(updateArray);
    }, 1000);
    updateArray();
});



var nextPage = "";
var mAccessToken = "";

var mFeedData = [];

function autoRequest() {
    if(true) {
        getData(mAccessToken)
    }
}


function getData(accessToken) {
    var url = getInitialURL(accessToken);

    $.get( url, function( data ) {
        for(i in data.data) {
            var cData = data.data[i];
            var time = cData.created_time != undefined ? cData.created_time : cData.updated_time;

            mFeedData.push(cData);
        }

        console.log(data);
        // $(window).scrollTop($(document).height());
        if(data.data.length>0) {
            nextPage = data.paging.next;
            getData(accessToken);
        } else {
            //alert("no more data");
        }
    });
}

function getInitialURL(accessToken) {
    var url = nextPage;
    if(url.length==0) {
        url = "https://graph.facebook.com/v2.2/me/feed?access_token=" + accessToken;
    }
    nextPage = "";
    return url;
}
