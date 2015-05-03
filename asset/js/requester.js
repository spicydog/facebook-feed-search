
var mAccessToken = "";

var mFeedData = [];

var isRequesting = false;

function autoRequest() {
    isRequesting = false;
    requestMode = 1;
    getData();
}

function convertDateTimeToUnix(time) {

    // To make it work on Safari, I use the code from
    // https://stackoverflow.com/questions/6427204/date-parsing-in-javascript-is-different-between-safari-and-chrome
    var str = time.split(/[^0-9]/);
    var date = new Date (str[0],str[1]-1,str[2],str[3],str[4],str[5]);
    return (date.getTime()/1000);
}

var latestFeedTimestamp = 0;
var oldestFeedTimestamp = 0;
var requestMode = 0;

//"previous": "https://graph.facebook.com/v2.3/10152644715888571/feed?since=1430614491&limit=25&__paging_token=enc_AdDMkZCHjZCxYzR4Ve82RkRvQqyrw8pdMZA3Agttin0MqAnIk91af1eXhp488Bn6CNvoW1FpEj11RjzVZCNH5nQtZACS6",
//    "next": "https://graph.facebook.com/v2.3/10152644715888571/feed?limit=25&until=1429798256&__paging_token=enc_AdC84BDHvCjTozxZB2s5ssbxF7fSxBUF8cGZB29YYnqzi1swXdi3ArF0QCvyCuWZAJdxIW4Ck3kVladdDZCUz9cLmDTC"



function getData() {
    if(latestFeedTimestamp == 0 && oldestFeedTimestamp == 0) {
        console.log("Request initial feeds");
        var url = generateFeedRequestURL(mAccessToken,0,0,0);
        requestFeed(url);
    } else if(requestMode==1) {
        console.log("Request NEWER feeds from: " + latestFeedTimestamp);
        var url = generateFeedRequestURL(mAccessToken,latestFeedTimestamp,0,0);
        requestFeed(url);
    } else if(requestMode==-1) {
        console.log("Request OLDER feeds from: " + oldestFeedTimestamp);
        var url = generateFeedRequestURL(mAccessToken,0,oldestFeedTimestamp,0);
        requestFeed(url);
    }
}

function requestFeed(url) {

    if(isRequesting) {
        $.get( url, function( data ) {
            processData(data);
        });
    }
}

function processData(data) {

    var newFeedCount = 0;
    for(i in data.data) {
        var feedData = data.data[i];

        if(feedData) {

            var timestamp = convertDateTimeToUnix(feedData.created_time);

            feedData.timestamp = timestamp;

            if(latestFeedTimestamp==0 || timestamp>latestFeedTimestamp) {
                latestFeedTimestamp = timestamp;
            }

            if(oldestFeedTimestamp==0 || timestamp<oldestFeedTimestamp) {
                oldestFeedTimestamp = timestamp;
            }

            if(checkIsNewFeed(feedData)) {
                newFeedCount++;
                mFeedData.push(feedData);
            }

        }
    }

    if(newFeedCount>0) {
        console.log("Insert new feeds " + newFeedCount + " recodes");
        nextPage = data.paging.next;
        if(isRequesting) {
            getData();
        }
    } else {
        if(requestMode==1) {
            requestMode = -1;
            console.log("No more new feed, look for old feed");
            isRequesting = true;
        } else if(requestMode==-1) {
            requestMode = 0;
            console.log("No more old feed, request done!");
            isRequesting = false;
        }
        getData();
    }
}

function checkIsNewFeed(feedData) {
    var isExisted = false;
    for(i in mFeedData) {
        if(mFeedData[i].id == feedData.id) {
            isExisted = true;
            break;
        }
    }
    return !isExisted;
}


function generateFeedRequestURL(accessToken,since,until,limit) {

    url = "https://graph.facebook.com/v2.2/me/feed?access_token=" + accessToken;
    if(since>0) {
        url += '&since=' + since;
    }

    if(until>0) {
        url += '&until=' + until;
    }

    if(limit>0) {
        url += '&limit=' + limit;
    }

    return url;
}