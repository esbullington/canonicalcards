/// <reference path="defs/browserify/browserify.d.ts" />
/// <reference path="defs/lodash/lodash.d.ts" />
/// <reference path="defs/d3/d3.d.ts" />
"use strict";

import d3 = require('d3');

interface IDataRaw {
  date: string;
  price: string;
}
interface IData {
  date: Date;
  price: number;
}

interface IConfig {
  data: string[][];
}

var margin = {top: 10, right: 10, bottom: 100, left: 40},
  margin2 = {top: 430, right: 10, bottom: 20, left: 40},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom,
  height2 = 500 - margin2.top - margin2.bottom;

var parseDate = d3.time.format("%d-%b-%y").parse;

var x = d3.time.scale().range([0, width]),
  x2 = d3.time.scale().range([0, width]),
  y = d3.scale.linear().range([height, 0]),
  y2 = d3.scale.linear().range([height2, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom"),
  xAxis2 = d3.svg.axis().scale(x2).orient("bottom"),
  yAxis = d3.svg.axis().scale(y).orient("left");

var brush = d3.svg.brush()
  .x(x2)
  .on("brush", brushed);

var area = d3.svg.area()
  .interpolate("monotone")
  .x(function(d) { return x(d.date); })
  .y0(height)
  .y1(function(d) { return y(d.price); });

var area2 = d3.svg.area()
  .interpolate("monotone")
  .x(function(d) { return x2(d.date); })
  .y0(height2)
  .y1(function(d) { return y2(d.price); });

var svg = d3.select("#chart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

svg.append("defs").append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("width", width)
  .attr("height", height);

var chartFocus = svg.append("g")
  .attr("class", "focus")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function brushed(focus: D3.Selection) {
  x.domain(brush.empty() ? x2.domain() : brush.extent());
  chartFocus.select(".area").attr("d", area);
  chartFocus.select(".x.axis").call(xAxis);
}

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

exports.renderChart = function(config: IConfig) {

  var data: IData[] = [];

  config.data.forEach(function(d) {
    var datum = <IData>{};
    datum.date = parseDate(d[0]);
    datum.price = parseFloat(d[1]);
    data.push(datum);

  });

  x.domain(d3.extent(data.map(function(d) { return d.date; })));
  y.domain([0, d3.max(data.map(function(d) { return d.price; }))]);
  x2.domain(x.domain());
  y2.domain(y.domain());


  chartFocus.append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", area);

  chartFocus.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  chartFocus.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  context.append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", area2);

  context.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height2 + ")")
    .call(xAxis2);

  context.append("g")
    .attr("class", "x brush")
    .call(brush)
    .selectAll("rect")
    .attr("y", -6)
    .attr("height", height2 + 7);

};

export module Chart {
  'use strict';

  export function renderIt(indata: string) {

    console.log(indata);
    console.log("You got it!");

  };
}
