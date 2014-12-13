var React = require('react');
var Router= require('react-router')
var RouteHandler = Router.RouteHandler;
var Nav = require('./Nav');
var Footer = require('./partials/Footer'); 
var PubSub = require('pubsub-js');
var EventTypes = require('../constants/EventTypes');
// User Events
var FLASH_OPEN = EventTypes.FLASH_OPEN;
var FLASH_CLOSE = EventTypes.FLASH_CLOSE;
var AUTHENTICATED = EventTypes.AUTHENTICATED;
var auth = require('./auth');
var Nav = require('./Nav');

var Display = React.createClass({

  getInitialState: function () {
    return {
      flash: {},
      alertVisible: false,
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
    var self = this;
    PubSub.subscribe(FLASH_CLOSE, function(msg, data) {
      if (self.isMounted()) {
        self.setAlertState(false);
      }
    });
    PubSub.subscribe(FLASH_OPEN, function(msg, data) {
      if (self.isMounted()) {
        self.raiseFlash(data);
      }
    });
    PubSub.subscribe(AUTHENTICATED, function(msg, data) {
      if (self.isMounted()) {
        console.log('AUTHENTICATED');
      }
    });
  },

  raiseFlash: function(flash) {
    if (this.isMounted()) {
      this.setState({flash: flash});
      this.setState({alertVisible: true});
    }
  },

  setAlertState: function(state) {
    if (this.isMounted()) {
      this.setState({alertVisible: state});
    }
  },
  
  renderFlashMessage: function() {
    var html = this.state.flash.html;
    if (html) {
      var key = {
        __html: html
      };
      return <div id="flash-html" dangerouslySetInnerHTML={key}></div>;
    } else {
      return <span id="flash-message">{this.state.flash.message}</span>;
    }
  },

  renderFlash: function() {
    var alertStyle = {
      'margin-top': '20px'
    };
    if (this.state.alertVisible) {
      return (
        <div className={"alert alert-dismissible alert-" + this.state.flash.type + " fade in"} role="alert">
          <button id={this.state.flash.id} type="button" className="close" data-dismiss="alert">
          <span aria-hidden="true">&times;</span>
          <span className="sr-only">Close</span></button>
          <strong>{this.state.flash.header}</strong> {this.renderFlashMessage()}
        </div>
      );
    }
  },

  render: function() {
    return (
      <div id="wrap">
        <Nav loggedIn={this.state.loggedIn} />
        <div className="container">
          <div className='row'>
            <div className='col-md-10'>
              { this.renderFlash() }
            </div>
          </div>
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
