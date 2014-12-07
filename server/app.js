var fs = require('fs');
var qs = require('querystring');
var parse = require('csv-parse');
var port = 4000;
var express = require('express');

var app = express();


var CSV_ARRAY;

fs.createReadStream('data/cards.csv').pipe(
  parse({delimiter: ','}, function(err, output) {
    CSV_ARRAY = output;
  })
);

app.get('/query', function(req, res) {

  console.log(req.query);

  var i = parseInt(req.query.index);

  res.json({'result': 'success', 'data': CSV_ARRAY[i]});

});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/../public/index.html');
});

module.exports = app;

