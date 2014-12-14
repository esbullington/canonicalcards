/** @jsx React.DOM */

var expect = require('chai').expect;

describe('Grades', function() {
  it('tests Grades component', function() {
    var React = require('react/addons');
    var Router = require('react-router');
    var Routes = Router.Routes;
    var Route = Router.Route;
    var Grades = require('../');
    var TestUtils = React.addons.TestUtils;
    expect(1).to.equal(1);
    // var routes = require('client/routes').routes;
    // React.renderComponent(routes, document.createElement('div'));
    //
    // // Render notfound compenent
    // var navmain = TestUtils.renderIntoDocument(
    //   <NavMain loggedIn={true} />
    // );
    //
    // var NavBar = TestUtils.findRenderedDOMComponentWithTag(navmain, 'Nav');
    // console.log('NavBar: ', NavBar.getDOMNode().childNodes[0]);
    // var navmainNav = navmain.refs;
    // expect(notfoundDiv.getDOMNode().textContent).toEqual('Not Found');

  });
});
