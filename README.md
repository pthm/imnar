![node-recaptcha](http://i.imgur.com/JL8sXZA.png)  
**A module for verifying ReCaptcha responses**

Not tested, use at your own risk

##Usage

````javascript

ReCaptcha({
  secret: 'RECAPTCHA_SECRET_HERE',
  sendIp: false
})

app.use(ReCaptcha.middleware);

````

Non middleware usage coming
