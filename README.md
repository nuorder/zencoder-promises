
# zencoder-promises

> A promise-based implementation of the Zencoder API in Node.js

## Usage 

Checkout the files in `/test/` where each features are automatically demonstrated/tested.

## Install

```bash
$ npm install zencoder-promises
```

## Examples

### Creating a job (AWS S3)

```javascript

// module
var Zencoder = require('zencoder-promises');

// zencoder api key
var zencoder_api_key = 'YOUR_ZENCODER_API_KEY';

// instatiate a new module instance with key attached
var transcoder = new Zencoder(zencoder_api_key);

// job config
var job = {
  "input": "s3://yourbucket/some/path/the-californians.mp4",
  "outputs": [
    {
      "url": "s3://yourbucket/some/path/the-californians.mov",
      "credentials": "s3"
    }
  ]
};

// build promise
var transcodePromise = transcoder.createJob(job);

// and just like that ...
transcodePromise.then(function(jobInfo) {
  console.log(jobInfo);
}, function(error) {
  console.error(error);
});

```

## Running Tests

Lines `19-30` of `/lib/zencoder-promises.js` need to be edited with your correct credentials and paths.

Next,

```bash
$ npm install
$ sudo npm install mocha -g
$ make test
```

## Credits

This module is based on Ryan Faerman's implemenetation named [node-zencoder](https://github.com/ryanfaerman/node-zencoder)

The project is a module produced by [NuORDER](http://www.nuorder.com/)
