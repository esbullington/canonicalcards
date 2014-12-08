var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;
var auth = require('./auth');

var Logout = React.createClass({
  componentDidMount: function () {
    auth.logout();
  },

  render: function () {
    return <p>You are now logged out</p>;
  }
});

module.exports = Logout;
