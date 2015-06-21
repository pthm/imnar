var express = require('express');
var ReCaptcha = require('../index')({
  secret: '6Ld_qQgTAAAAAODcj6iMDQ-8PvisQNT64E0VF67M'
});
var bodyParser = require('body-parser');

var app = express();

app.post('/middleware',bodyParser.urlencoded({ extended: false }), ReCaptcha.middleware, function(req, res){
  res.json(req.recaptcha)
});

app.post('/standalone',bodyParser.urlencoded({ extended: false }), function(req, res){
  ReCaptcha.check(req.body['g-recaptcha-response']).then(function(result){
    res.json(result);
  }, function(err){
    res.json(err);
  });
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});
