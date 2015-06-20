var ReCaptcha = require('../index');

describe('ReCaptcha', function(){

  it('should throw an error if no secret is provided', function(done){
    try{
      ReCaptcha();
    } catch(e) {
      done();
    }
  });

  it('should not throw an error if a secret is provided', function(done){
    try{
      ReCaptcha({
        secret: 'SECRET'
      })
    } catch (e) {
      done(e);
    }

    done();
  });

  it('should be able to keep a secret', function(done){
    if(ReCaptcha.secret() == 'SECRET'){
      done();
    } else {
      throw new Error('Couldn\'t keep a secret');
    }
  });

});
