
/**
 * @module zencoder-promises
 * @author Edward Hotchkiss @ NuORDER. <hello@nuorder.com>
 * @author Ryan Faerman <ryan@faerman.net>
 **/

var fs = require('fs')
  , url = require('url')
  , https = require('https')
  , _ = require('underscore')
  , promise = require('node-promise')
  , Promise = promise.Promise
  , request = require('request')
  , querystring = require('querystring');

/**
 * @class Zencoder
 * @param {String} cert Zencoder certificate absolute path
 * @param {String} AWS S3 API Key
 **/

var Zencoder = module.exports = function(api_key) {
  // aws s3 key
  this._api_key = api_key;
  // check for "valid" API Key
  if (typeof(typeof(this._api_key)) !== 'string' || this._api_key.length !== 32) {
    return (function() {
      throw new Error('API Key must be a valid hash!');
    })();
  };
  // api versioning, endpoints and defaults
  this._base_url = 'https://app.zencoder.com/api/v2';
  // set base headers
  this._headers = {
    'Content-Type' : 'application/json',
    'User-Agent'   : 'zencoder-promises',
    'Accept'       : 'application/json'
  };
  // return instance
  return this;
};

/**
 * @method noop
 * @description n00p
 **/

function noop(){};

/**
 * Builds and executes a Zencoder api call
 * @private _request
 * @param {String} method HTTP Method
 * @param {Object} body
 * @returns {Object} promise
 **/

Zencoder.prototype._request = function(method, path, body) {
  var promise = new Promise();
  // extend and build headers
  this._headers = _.extend({
    'Zencoder-Api-Key': this._api_key
  }, this._headers);
  // setup `request` options
  var options = {
    uri     : this._base_url + path,
    headers : this._headers,
    method  : method
  };
  if (method !== 'GET') {
    this._headers = _.extend({
      'Content-Length': body.length
    }, this._headers);
    // stringify body
    body = JSON.stringify(body);
    options.body = body;
  } else {
    delete this._headers['Content-Length'];
  };
  // make actual API call
  request(options, function(error, response, body) {
    if (error) {
      promise.reject(error);
    } else {
      switch (response.statusCode) {
        // bad endpoint
        case 404:
          promise.reject(error, true);
          break;
        // success
        case 200:
        case 201:
          try {
            // try to parse the JSON. Valid?
            var data = JSON.parse(body);
            // resolve with the parsed datsa
            promise.resolve(data);
          } catch (error) {
            promise.reject(error, true);
          };
          break;
        // Unknown status code
        default:
          promise.reject(new Error('Unknown Error!'));
          break;
      };
    };
  });
  return promise;
};

/**
 * @method get
 * @description Performs a GET request to Zencoder
 * @param {String} path API endpoint
 * @param {Object} body Data
 * @return {Object} promise CommonJS Promise
 **/

Zencoder.prototype.get = function(path) {
  return this._request('GET', path);
};

/**
 * @method put
 * @description Performs a PUT request to Zencoder
 * @param {String} path API endpoint
 * @param {Object} body Data
 * @return {Object} promise CommonJS Promise
 **/

Zencoder.prototype.put = function(path, body) {
  return this._request('PUT', path, body);
};

/**
 * @method post
 * @description Performs a POST request to Zencoder
 * @param {String} path API endpoint
 * @param {Object} body Data
 * @return {Object} promise CommonJS Promise
 **/

Zencoder.prototype.post = function(path, body) {
  return this._request('POST', path, body);
};

/**
 * @section
 * @description Higher Level Methods for calling the API
 **/

Zencoder.prototype.listJobs = function() {
  return this.get('/jobs');
};

Zencoder.prototype.createJob = function(job) {
  return this.post('/jobs', job);
};

Zencoder.prototype.jobDetails = function(jobId) {
  return this.get('/jobs/' + jobId + '.json');
};

Zencoder.prototype.resubmitJob = function(jobId) {
  return this.put('/jobs/' + jobId + '/resubmit.json');
};

Zencoder.prototype.cancelJob = function(jobId) {
  return this.put('/jobs/' + jobId + '/cancel.json');
};

Zencoder.prototype.jobProgress = function(jobId) {
  return this.get('/jobs/' + jobId + '/progress.json');
};

Zencoder.prototype.inputDetails = function(inputId) {
  return this.get('/inputs/' + inputId + '.json');
};

Zencoder.prototype.inputProgress = function(inputId) {
  return this.get('/inputs/' + inputId + '/progress.json');
};

Zencoder.prototype.outputDetails = function(outputId) {
  return this.get('/outputs/' + outputId + '.json');
};

Zencoder.prototype.outputProgress = function(outputId) {
  return this.get('/outputs/' + outputId + '/progress.json');
};

Zencoder.prototype.listNotifications = function(options) {
  return this.get('/notifications', options);
};

Zencoder.prototype.createAccount = function(params, options) {
  return this.post('/account', params, options);
};

Zencoder.prototype.accountDetails = function() {
  return this.get('/account');
};

Zencoder.prototype.accountIntegration = function() {
  return this.put('/account/integration');
};

Zencoder.prototype.accountLive = function() {
  return this.put('/account/live');
};

Zencoder.prototype.minutesReport = function(options) {
  return this.get('/reports/minutes', options);
};

/* EOF */