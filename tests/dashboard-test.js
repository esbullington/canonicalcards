
var expect = require('chai').expect;

describe('Cards', function() {
  it('renders cards', function() {
    var React = require('react/addons');

    var Dashboard = require('components/Dashboard');
    expect(Dashboard).to.be.ok();

    var TestUtils = React.addons.TestUtils;

    var dashboard = TestUtils.renderIntoDocument(
      <Dashboard />
    );

    // Verify that it has the same number of bars as the array's length
    var dashboardHeader = TestUtils.scryRenderedDOMComponentsWithTag(
      dashboard, 'h1');
    expect(dashboardHeader.length).to.be.greaterThan(0);
  });
});
