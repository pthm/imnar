![node-recaptcha](http://imgur.com/7xGreb1)
**A module for verifying ReCaptcha responses**

Not tested, use at your own risk

`npm install imnar`

##Usage

````javascript
var ReCaptcha = require('imnar');

ReCaptcha({
  secret: 'RECAPTCHA_SECRET_HERE',
  sendIp: false
})

app.use(ReCaptcha.middleware);

````

Non middleware usage coming
