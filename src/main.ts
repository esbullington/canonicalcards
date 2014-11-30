/// <reference path="defs/browserify/browserify.d.ts" />
/// <reference path="defs/lodash/lodash.d.ts" />
/// <reference path="defs/d3/d3.d.ts" />
"use strict";

var d3: D3.Base = require('d3');


// Create stack layout
var stackLayout = d3.layout.stack();
console.log(typeof stackLayout);

