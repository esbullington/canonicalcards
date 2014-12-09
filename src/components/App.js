var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;
var Nav = require('./Nav');
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
