var request = require('request');
var Q = require('q');

var ReCaptcha = function(options){
  if(!options.secret){
    throw new Error('No ReCaptcha Secret (Please provide your API secret key)')
  } else {
    this.secret = options.secret;
  }

  if(options.sendIp){
    this.sendIp = true;
  }

  if(options.endRequest){
    this.endRequest = true;
  }

  this.secret = options.secret;
};

ReCaptcha.prototype = {
  secret: null,
  sendIp: false,
  endRequest: false
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

    this._checkToken(options).then(function(response){
      req.recaptcha = response;
      next();
    }, function(response){
      req.recaptcha = response;
      if(this.endRequest){
        res.status(400).end();
      } else {
        next();
      }
    })
  }
};

ReCaptcha.prototype.check = function(token, ip){
  var deferred = Q.defer();

  if(!token){
    deferred.reject(new Error('No token supplied'));
  } else {
    var options = {
      response: token
    };

    if(ip){
      options.remoteip = ip;
    }

    this._checkToken(options).then(function(response){
      deferred.resolve(response);
    }, function(response){
      deferred.reject(response);
    })
  }

  return deferred.promise;
};

ReCaptcha.prototype._checkToken = function(options){
  var data = {
    secret: this.secret,
    response: options.response
  };

  if(options.ip && this.sendIp){
    data.remoteip = options.ip;
  }

  var deferred = Q.defer();

  var url = 'https://www.google.com/recaptcha/api/siteverify';

  request.post(url, {form:data}, function (err, res, body) {
    body = JSON.parse(body);

    if(err){
      deferred.reject(err);
    }

    if(body.success){
      deferred.resolve(body);
    } else {
      deferred.reject(body);
    }
  });

  return deferred.promise;
};

ReCaptcha.prototype.secret = function(input){
  if(input){
    this.secret = input;
  }

  return this.secret;
};

ReCaptcha.prototype.sendIp = function(input){
  if(input){
    this.sendIp = input;
  }

  return this.sendIp;
};

module.exports = ReCaptcha;
