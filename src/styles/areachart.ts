/// <reference path="../defs/browserify/browserify.d.ts" />
/// <reference path="../defs/d3/d3.d.ts" />
"use strict";

var d3: D3.Base = require('d3');

d3.selectAll('.axis, line')
    .selectAll('.axis, path')
    .style({'fill': 'none', 'stroke': '#000', 'shape-rendering': 'crispEdges'});
