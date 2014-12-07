
var expect = chai.expect;

(function() {
  var originalStringify = JSON.stringify;
  JSON.stringify = function(obj) {
    var seen = [];

    var result = originalStringify(obj, function(key, val) {
      if (val instanceof HTMLElement) { return val.outerHTML }
      if (typeof val == "object") {
        if (seen.indexOf(val) >= 0) { return "[Circular]"; }
        seen.push(val);
      }
      return val;
    });
    return result;
  };
})();

describe('Setting Up', function(){
  describe('d3', function(){
    it('should exist', function(){
      expect(d3).to.exist;
    })
  })
  describe('DashStock', function(){
    it('should exist', function(){
      expect(DashStock).to.exist;
    })
  })
})

describe('Render Chart', function(){

  var config;

  before(function(done) {

    var arr = [
          [ "31-May-07", "121.19"],
          [ "30-May-07", "118.77"],
          [ "29-May-07", "114.35"],
          [ "25-May-07", "113.62"],
          [ "24-May-07", "110.69"],
          [ "23-May-07", "112.89"],
          [ "22-May-07", "113.54"],
          [ "21-May-07", "111.98"],
          [ "18-May-07", "110.02"],
          [ "17-May-07", "109.44"],
          [ "16-May-07", "107.34"],
          [ "15-May-07", "107.52"],
          [ "14-May-07", "109.36"],
          [ "11-May-07", "108.74"],
          [ "10-May-07", "107.34"]
    ];

    config = {
      el: "#chart",
      data: arr,
      height: 500,
      width: 960 
    };
    
    DashStock.renderChart(config);

    done();

  })

  describe('Chart div', function(){
    it('should exist and have a svg child', function() {
      var chart = $("#chart");
      expect(chart).to.exist;
      var svg = chart.find("svg");
      expect(svg).to.exist;
    })
    it('svg child should have width/height given in config', function() {
      var svg = $("#chart svg");
      expect(svg.height()).to.equal(config.height);
      expect(svg.width()).to.equal(config.width);
    })
  })

  describe('Chart clippath', function(){
    it('should exist', function() {
      var clip = d3.select("#clip");
      expect(clip).to.exist;
    })
    it('should have rect child', function() {
      var r = $("#clip rect");
      expect(r).to.exist;
      var height = r.prop("height").baseVal.value;
      expect(height).to.equal(390);
    })
  })

})
