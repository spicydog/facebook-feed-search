var mAccessToken = "";

var mFeedData = [];

var isRequesting = false;

function autoRequest() {
    isRequesting = true;
    requestMode = 1;
    requestFeeds();
}

function convertDateTimeToUnix(time) {
    // To make it work on Safari, I use the code from
    // http://stackoverflow.com/a/6427318/967802
    var str = time.split(/[^0-9]/);
    var date = new Date (str[0],str[1]-1,str[2],str[3],str[4],str[5]);
    return (date.getTime()/1000);
}

var latestFeedTimestamp = 0;
var oldestFeedTimestamp = 0;
var requestMode = 0;


function requestFeeds() {
    var url;
    if(latestFeedTimestamp == 0 && oldestFeedTimestamp == 0) {
        console.log("Request initial feeds");
        url = generateFeedRequestURL(mAccessToken,0,0,0);
    } else if(requestMode==1) {
        console.log("Request NEWER feeds from: " + new Date(latestFeedTimestamp*1000));
        url = generateFeedRequestURL(mAccessToken,latestFeedTimestamp,0,0);
    } else if(requestMode==-1) {
        console.log("Request OLDER feeds from: " + new Date(oldestFeedTimestamp*1000));
        url = generateFeedRequestURL(mAccessToken,0,oldestFeedTimestamp,0);
    }
    if(url) {
        requestFeed(url);
    }
}

function requestFeed(url) {
    if(isRequesting) {
        callAjax(url, function(response) {
            processData(JSON.parse(response));
        });
    }
}

function callAjax(url, callback){
    // Code from: http://stackoverflow.com/a/18324384/967802
    var xmlhttp;
    // compatible with IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            callback(xmlhttp.responseText);
        }
    }
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
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

            if(!getDocumentInfo(feedData.id)) {
                newFeedCount++;

                var message = feedData.from.name + " ";
                if(feedData.message) {
                    message += feedData.message + " ";
                }

                if(feedData.description) {
                    message += feedData.description + " ";
                }
                var document = {"id":feedData.id,"time":timestamp,"type":feedData.type};
                addDocumentToBarrel(message,document)

                mFeedData.push(feedData);
            }

        }
    }

    if(newFeedCount>0) {
        console.log("Indexed " + newFeedCount + " feeds.");
        nextPage = data.paging.next;
        if(isRequesting) {
            requestFeeds();
        }
    } else {
        if(requestMode==1) {
            requestMode = -1;
            console.log("No more new feed, look for old feed.");
            isRequesting = true;
        } else if(requestMode==-1) {
            requestMode = 0;
            console.log("No more old feed, requesting process complete.");
            isRequesting = false;
        }
        requestFeeds();
    }


    storySearchApp.scope.updateRequestSummary();
    storySearchApp.scope.$apply();
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

function getFeedData(id) {
    for(i in mFeedData) {
        if(mFeedData[i].id == id) {
            return mFeedData[i];
        }
    }
    return false;
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