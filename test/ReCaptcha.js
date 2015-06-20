var ReCaptcha = require('../index');

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
