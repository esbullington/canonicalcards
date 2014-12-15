var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;
var Nav = require('../Nav');
var Footer = require('./Footer');
var Firebase = require('firebase');
var presenceRef = new Firebase('https://flashcardsapp.firebaseio.com/disconnectmessage');
var initPresenceMonitor = require('./controller').initPresenceMonitor;
var PubSub = require('pubsub-js');
var EventTypes = require('constants/EventTypes');
var AUTHENTICATED = EventTypes.AUTHENTICATED;
var auth = require('../auth');

var App = React.createClass({

  getInitialState: function () {
    return {
      loggedIn: auth.loggedIn(),
    };
  },

  setStateOnAuth: function (loggedIn) {
    this.setState({
      loggedIn: loggedIn
    });
  },

  componentWillMount: function () {
    auth.onChange = this.setStateOnAuth;
  },

  componentDidMount: function() {
    if (this.state.loggedIn) {
      var userId = this.state.loggedIn.uid;
      initPresenceMonitor(userId);
    }
    var isMounted = function(msg, data) {
      if (this.isMounted()) {
        this.setState({loggedIn: data});
      }
    };
    PubSub.subscribe(AUTHENTICATED, isMounted.bind(this));
  },

  render: function () {
    return (
      <div>
        <RouteHandler/>
      </div>
    );
  }
});

module.exports = App;
