//var tweet2json = require('tweet2json');

var i = 0;

var twitter = {};
twitter.latest = 0;
twitter.oldest = 0;
twitter.updateTwitter = function(req){

  var callback = function (data) {
    for (var n = 0; n < data.length; n+=1){
      var div = document.createElement('div');
      div.id = i.toString();
       document.getElementById("container").appendChild(div);
      var tweetObject = data[n];
      div.innerHTML += tweetObject.author;
      div.innerHTML += '<p>' + tweetObject.tweet + '</p>';
      i = i + 1;
    }
  }

  req["id"] = '703893233160626176';
  req["domId"] = i;
  req["maxTweets"] = 10;
  req["dataOnly"] = true;
  req["customCallback"] = callback;

  twitterFetcher.fetch(req);
  i=0
};

twitter.updateTwitter({});
window.setInterval(function(){
twitter.updateTwitter({});
}, 10000);

