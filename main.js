var http = require('http');
var fs = require('fs');
var formidable = require('formidable');
var util = require('util');
var events = require('events');
var path = require('path');
//var twitter = require('twitter')

//var client = new twitter({
//  consumer_key: process.env.TWITTER_CONSUMER_KEY,
//  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
//  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
//  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
//});

var twitterClient = http.createClient(80, "api.twitter.com");
var tweetEmitter = new events.EventEmitter();
var getTweets = function (){
  var request = twitterClient.request("GET", "/1/statuses/public_timeline.json", {"host":"api.twitter.com"});
  request.addListener("response", function (response){
    var body = "";
    response.addListener("data", function (data){body += data;});
    response.addListener("end", function (){var tweets = JSON.parse(body);if(tweets.length>0){tweetEmitter.emit("tweets", tweets)}});
  });
  request.close();
}
setInterval(getTweets, 5000);
var listener = tweetEmitter.addListener("tweets", function(tweets){tweet=JSON.stringify(tweets)});

var composePage = function (reply, data){reply.writeHead(200, {'Content-Type': 'text/html'}); reply.write(data); reply.end();};

var responder = { responses: {} };
responder.addResponse = function (method, callback) { this.responses[method] = callback;};
responder.process = function (method, request, reply) {
  if (method in this.responses){this.responses[method](request, reply);}
  else{console.log("Unknown request!")}
};
//client.getSearch({'q':'#haiku','count': 10}, function(){console.log("err")}, function(){console.log("sux")})
responder.addResponse("get", function (request, reply) {composePage(reply, tweet); return 0});

var server = http.createServer(function (request, reply) {
  responder.process(request.method.toLowerCase(), request, reply);
});

server.listen(1188);
console.log("listenin");