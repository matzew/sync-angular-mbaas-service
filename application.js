'use strict';

var express = require('express')
  , log = require('fh-bunyan').getLogger(__filename)
  , mbaasApi = require('fh-mbaas-api')
  , mbaasExpress = mbaasApi.mbaasExpress()
  , fhRestExpress = require('fh-rest-express-router')
  , fhRestMemoryAdapter = require('fh-rest-memory-adapter')
  , app = module.exports = express();

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys([]));
app.use('/mbaas', mbaasExpress.mbaas);

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

// Expose the users store as a RESTful "/users" route
app.use(fhRestExpress('users', fhRestMemoryAdapter()));

// Important that this is last!
app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.VCAP_APP_PORT || 9001;
app.listen(port, function() {
  log.info('App started at: %s on port: %s', new Date(), port);
});
