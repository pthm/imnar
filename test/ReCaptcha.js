var ReCaptcha = require('../index');
var nock = require('nock');

describe('ReCaptcha Errors', function(){

  it('should throw an error is no secret is set', function(done){
    try{
      ReCaptcha.check('someToken')
    } catch(e){
      done();
    }
  });

});

describe('ReCaptcha Config', function(){

  it('should be able to keep a secret', function(done){
    ReCaptcha({
      secret: 'TEST'
    });

    if(ReCaptcha.secret() === 'TEST'){
      done();
    } else {
      done(new Error('Couldn\'t keep a secret!'));
    }
  });

  it('should be able to set other config values', function(done){
    ReCaptcha({
      secret: 'TEST',
      sendIp: true,
      endRequest: true
    });

    if(ReCaptcha.sendIp && ReCaptcha.endRequest()){
      done();
    } else {
      done(new Error('Couldn\'t do config'));
    }
  });

});

describe('Standalone ReCaptcha Check', function(){

  it('should return successfully', function(done){

    var google = nock('https://www.google.com')
      .post('/recaptcha/api/siteverify')
      .reply(200, {
        success: true
      });

    ReCaptcha.check('PASS').then(function(response){
      done();
    }, function(err){
      done(new Error('Uncessful'))
    })

  });

  it('should handle a failure', function(done){
    var google = nock('https://www.google.com')
      .post('/recaptcha/api/siteverify')
      .reply(200, {
        success: false
      });

    ReCaptcha.check('FAIL').then(function(response){
      done(new Error('Did not fail'));
    }, function(err){
      done()
    })
  })

});