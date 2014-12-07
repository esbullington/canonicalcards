var port = 4000;
var express = require('express');
var app = require('./server/app');

console.log('Listening on port ' + port);
app.listen(port);
