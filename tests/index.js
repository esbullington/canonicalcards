var expect = require('chai').expect;  
var jsdom = require('jsdom');
var fs = require('fs');
var d3 = require('d3');
var chart = require('../src/main.js');

describe('ChartExists', function() {

  var document;

  before(function(cb) {

    // console.log('testing');
    // cb();
    var htmlStub = '<html><head></head><body><div id="chart"></div></body></html>' // html file skull with a container div for the d3 dataviz

    // pass the html stub to jsDom
    jsdom.env({
      features : { QuerySelector : true },
      src: [chart],
      html : htmlStub,
      done : function(errors,  window) {
        document = window.document;
        console.log('testing done');
        cb();
      }
    })

  });

  it('tests if chart Div exists and has svg child', function() {
    var chart = document.getElementById("chart");
    expect(chart).to.exist;
  });

});
