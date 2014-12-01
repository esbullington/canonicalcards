/// <reference path="defs/browserify/browserify.d.ts" />
/// <reference path="defs/lodash/lodash.d.ts" />
/// <reference path="defs/d3/d3.d.ts" />
"use strict";

import d3 = require('d3');
import chart = require('./stockchart');

var parseDate = d3.time.format("%d-%b-%y").parse;

d3.text("data/data.tsv", function(indata: string ) {

  chart.renderIt(indata);
  console.log('testing');

});
