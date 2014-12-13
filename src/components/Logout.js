var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;
var PubSub = require('pubsub-js');
var EventTypes = require('../constants/EventTypes');
// User Events
var AUTHENTICATED = EventTypes.AUTHENTICATED;
var Nav = require('./Nav');
var auth = require('./auth');

var Logout = React.createClass({
  componentDidMount: function () {
    // PubSub.publish(AUTHENTICATED, false);
    localStorage.clear();
    auth.logout();
  },

  render: function () {
    return <p>You are now logged out</p>;
  }
});

module.exports = Logout;
