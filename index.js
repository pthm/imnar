var request = require('request');
var Q = require('q');

var ReCaptcha = function(options){
  if(!options.secret){
    throw new Error('No ReCaptcha Secret (Please provide your API secret key)')
  }

  if(options.sendIp){
    this.sendIp = true;
  }

  this.secret = options.secret;
};

ReCaptcha.prototype = {
  secret: '',
  sendIp: false
};

ReCaptcha.middleware = function(req, res, next){
  if(!req.body['g-recaptcha-response'] || !req.body.recaptcha){
    res.status(400).end();
  } else {
    var options = {
      response: req.body['g-recaptcha-response'] || req.body.recaptcha
    };

    if(this.sendIp){
      options.remoteip = req.ip;
    }

    this.checkToken(options).then(function(){
      next();
    }, function(){
      res.status(400).end();
    })
  }
};

ReCaptcha.checkToken = function(options){
  var data = {
    secret: this.secret,
    response: options.response
  };

  if(options.ip && this.sendIp){
    data.remoteip = options.ip;
  }

  var deferred = Q.defer();

  var url = 'https://www.google.com/recaptcha/api/siteverify';
  var options = {
    method: 'post',
    body: {form:data},
    json: false,
    url: url
  };

  request.post(url, {form:data}, function (err, res, body) {
    body = JSON.parse(body);

    if(err){
      deferred.reject();
    }

    if(body.success){
      deferred.resolve(body);
    } else {
      deferred.reject(body);
    }
  });

  return deferred.promise;
};

module.exports = ReCaptcha;
