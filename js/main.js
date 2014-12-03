"use strict";

var parseDate = d3.time.format("%d-%b-%y").parse;

d3.text("data/data.tsv", function (indata) {
  var lines = indata.split('\n');
  var i,
    data = [],
    len = lines.length;
  for (i = 0; i < len - 1; i++) {
    if (i === 0) {
      continue;
    }
    var arr = lines[i].split('\t');
    data.push(arr);
  };
  var config = {
    el: "#chart",
    data: data
  };
  DashStock.renderChart(config);
});
