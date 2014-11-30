var expect = require('chai').expect;  

describe('AddTwo', function() {
  it('adds two', function() {
    var addTwo = require('../src/main.js').testFunction;
    expect(addTwo).to.exist;
  });
});
