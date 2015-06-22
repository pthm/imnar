# IMNAR [![build-status](https://travis-ci.org/pthm/imnar.svg)](https://travis-ci.org/pthm/imnar)
![imnar](http://i.imgur.com/7xGreb1.png)  
🙋**A module for verifying ReCaptcha responses**

[![imnar](https://nodei.co/npm/imnar.png)](https://www.npmjs.com/package/imnar)

## Usage

### Express / Connect  
When using IMAR with Express it needs a bodyParser higher up the middleware chain as it reads the ReCaptcha response
from `request.body['g-recpatcha-response']`

````javascript
var ReCaptcha = require('imnar');
var bodyParser = require('body-parser');
ReCaptcha({
  secret: 'RECAPTCHA_SECRET_HERE',
  sendIp: false
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(ReCaptcha.middleware);

````

### Standalone  
````javascript
var ReCaptcha = require('imnar');

ReCaptcha({
  secret: 'RECAPTCHA_SECRET_HERE',
  sendIp: false
})

ReCaptcha.check('g-recaptcha-response').then(function(success){
  console.log('Woohoo! captcha passed');
}, function(error){
  console.log('Uh oh! looks like you\'re a robot');
})
````

## Options

* **secret** Google ReCaptcha server secret
