var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;
var auth = require('./auth');


var Authentication = {
  statics: {
    willTransitionTo: function (transition) {
      if (!auth.loggedIn()) {
        Login.attemptedTransition = transition;
        transition.redirect('/login');
      }
    }
  }
};


module.exports = Authentication;
