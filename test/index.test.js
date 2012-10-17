
/**
 * @tests Main
 **/

var should = require('should')
  , Zencoder = require('../lib/zencoder-promises');

/**
 * @description Promises & Mocha = Sweet.
 **/

require('mocha-as-promised')();

/**
 * @description Enter your credentials to run tests
 **/

var testingConfig = {
  zencoder_api_key: 'YOUR_ZENCODER_API_KEY',
  job: {
    "input": "s3://yourbucket/some/path/the-californians.mp4",
    "outputs": [
      {
        "url": "s3://yourbucket/some/path/the-californians.mov",
        "credentials": "s3"
      }
    ]
  }
};

/**
 * @description A FAKE API KEY!
 **/

var fake_zen_key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456';

/**
 * @tests Basic Class Tests
 **/

describe('Basic Class Tests', function() {
  describe('Zencoder Class Instantiation', function() {
    it('Should instantiate without error', function() {
      var transcoder = new Zencoder(fake_zen_key);
      transcoder.should.be.an.object;
    }); 
    it('Should accept a proper format API Key', function() {
      var transcoder = new Zencoder(fake_zen_key);
      transcoder._api_key.should.be.a.string;
      transcoder._api_key.should.have.length(32);
    }); 
    it('Should throw an error with an invalid API Key', function() {
      (function() {
        var transcoder = new Zencoder('');
      }).should.throw('API Key must be a valid hash!');
    }); 
  });
});

/**
 * @tests Transcoding Tests with AWS S3
 **/

describe('Transcoding Tests', function() {
  describe('AWS S3 as Input', function() {
    it('Should transcode without error', function(done) {
      // setup new Zencoder
      var transcoder = new Zencoder(testingConfig.zencoder_api_key);
      // begin transcode
      var transcodePromise = transcoder.createJob(testingConfig.job);
      // return promise
      return transcodePromise.then(function(result) {
        return result.should.be.an.object;
      });
    }); 
  });
});

/* EOF */