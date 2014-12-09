var React = require('react');
var Router= require('react-router')
var RouteHandler = Router.RouteHandler;
var Nav = require('./Nav');
var Footer = require('./Footer'); 
var auth = require('./auth');

var Display = React.createClass({

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
  },

  render: function() {
    return (
      <div id="wrap">
        <Nav loggedIn={this.state.loggedIn} />
        <div className="container">
          <div className="row">
            <RouteHandler />
          </div>
        </div>
        <Footer />
      </div>
      );
  }

});


module.exports = Display;
