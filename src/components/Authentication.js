var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;
var Login = require('./Login');
var auth = require('./auth');


var Authentication = {
  statics: {
    willTransitionTo: function (transition) {
      if (!auth.loggedIn()) {
        Login.attemptedTransition = transition;
        transition.redirect('/display/login');
      }
    }
  }
};


module.exports = Authentication;
