var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;
var Nav = require('./Nav');
var Firebase = require('firebase');
var presenceRef = new Firebase('https://flashcardsapp.firebaseio.com/disconnectmessage');
var initPresenceMonitor = require('../controllers/appController').initPresenceMonitor;
var auth = require('./auth');

var App = React.createClass({

  getInitialState: function () {
    return {
      loggedIn: auth.loggedIn()
    };
  },

  setStateOnAuth: function (loggedIn) {
    this.setState({
      loggedIn: loggedIn
    });
  },

  componentWillMount: function () {
    auth.onChange = this.setStateOnAuth;
    auth.login();
  },

  componentDidMount: function() {
    var userId = '';
    initPresenceMonitor(userId);
  },

  render: function () {
    return (
      <div>
        <Nav loggedIn={this.state.loggedIn} />
        <div>
          <RouteHandler/>
        </div>
      </div>
    );
  }
});

module.exports = App;
