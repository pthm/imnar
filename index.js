var request = require('request');
var Q = require('q');

var options = {
  secret: null,
  sendIp: false,
  endRequest: false
};

var ReCaptcha = function(input){
  if(input && input.secret){
    options.secret = input.secret;
  }

  if(input && input.sendIp){
    options.sendIp = true;
  }

  if(input && input.endRequest){
    options.endRequest = true;
  }

  if(input && input.secret){
    options.secret = input.secret;
  }

  return ReCaptcha;
};

var checkToken = function(input){

  if(!options.secret || options.secret == null){
    throw new Error('No ReCaptcha Secret (Please provide your API secret key)');
  }

  var data = {
    secret: options.secret,
    response: input.response
  };

  if(options.ip && options.sendIp){
    data.remoteip = input.ip;
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

ReCaptcha.middleware = function(req, res, next){
  if(!req.body['g-recaptcha-response'] || !req.body.recaptcha){
    res.status(400).end();
  } else {
    var payload = {
      response: req.body['g-recaptcha-response'] || req.body.recaptcha
    };

    if(options.sendIp){
      payload.remoteip = req.ip;
    }

    checkToken(payload).then(function(response){
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


ReCaptcha.check = function(token, ip){
  var deferred = Q.defer();

  if(!token){
    deferred.reject(new Error('No token supplied'));
  } else {
    var payload = {
      response: token
    };

    if(ip){
      payload.remoteip = ip;
    }

    checkToken(payload).then(function(response){
      deferred.resolve(response);
    }, function(response){
      deferred.reject(response);
    })
  }

  return deferred.promise;
};

ReCaptcha.secret = function(input){
  if(input){
    options.secret = input;
  }
  return options.secret;
};

ReCaptcha.sendIp = function(input){
  if(input){
    options.sendIp = input;
  }
  return options.sendIp;
};

ReCaptcha.endRequest = function(input){
  if(input){
    options.endRequest = input;
  }
  return options.endRequest;
};

module.exports = ReCaptcha;
