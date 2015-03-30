
var nextPage = "";
var mAccessToken = "";
var count = 0;

function getData(accessToken) {
    var url = getInitialURL(accessToken);
    $.get( url, function( data ) {
        for(i in data.data) {
            var cData = data.data[i];
            var time = cData.created_time != undefined ? cData.created_time : cData.updated_time;
            $("#data").append("<p>"+ (++count) + " : (" + cData.id + ") : " + time +" : " + cData.privacy.value + "<br />"+cData.message+ '<br /><a target="_blank" href="' +cData.link+'">'+cData.name+'</a></p>');
        }

        $("#next").html(data.paging.next);
        console.log(data);
        // $(window).scrollTop($(document).height());
        if(data.data.length>0) {
            nextPage = data.paging.next;
            getData(accessToken);
        } else {
            alert("no more data");
        }
    });
}

function getInitialURL(accessToken) {
    var url = nextPage;
    if(url.length==0) {
        url = "https://graph.facebook.com/v2.2/me/feed?access_token=" + accessToken;
        // url = "https://graph.facebook.com/v2.2/me/links?access_token=" + accessToken;
        // url = "https://graph.facebook.com/v2.2/me/statuses?access_token=" + accessToken;
    }
    nextPage = "";
    return url;
}

$("#more").click(function() {
    getData(mAccessToken);
});