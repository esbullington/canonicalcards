
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
