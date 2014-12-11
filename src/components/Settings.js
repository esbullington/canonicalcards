var React = require('react');
var Firebase = require('firebase');
var Authentication = require('./Authentication');
var constants = require('../constants/AppConstants');
var localStorageKey = constants.localStorageKey;
var PubSub = require('pubsub-js');
var EventTypes = require('../constants/EventTypes');
var FLASH_OPEN = EventTypes.FLASH_OPEN;
var ref = new Firebase("https://flashcardsapp.firebaseio.com/");
var $ = window.jQuery;

var Settings = React.createClass({

  mixins: [ Authentication ],

  getInitialState: function() {
    return {
      radioChecked: {yes: false, no: false},
      proposedRadioVal: '',
      settingsRef: null,
      userRef: null,
      warningVisible: false
    };
  },

  handleSettingsError: function(error) {
    if (error) {
      console.log('Error: error saving settings, please try again');
    }
  },

  cancelReset: function(e) {
    this.setState({warningVisible: false});
  },

  resetMethod: function(e) {
    this.state.userRef.child('stats').remove();
    if (this.state.proposedRadioVal === 'yes') {
      this.state.settingsRef.set({srs: true}, this.handleSettingsError);
      this.setState({radioChecked: {yes: true, no: false}});
    } else if (this.state.proposedRadioVal === 'no') {
      this.state.settingsRef.set({srs: false}, this.handleSettingsError);
      this.setState({radioChecked: {yes: false, no: true}});
    }
    this.setState({proposedRadioVal: '', warningVisible: false});
  },

  renderWarning: function() {
    var alertStyle = {
      'margin-top': '20px'
    };
    var oldMethod, newMethod;
    if (this.state.proposedRadioVal === 'yes') {
      oldMethod = 'SRS';
      newMethod = 'flashcard';
    } else {
      oldMethod = 'flashcard';
      newMethod = 'SRS';
    }
    if (this.state.warningVisible) {
      return (
        <div className="alert alert-dismissible alert-danger fade in" role="alert">
          <button type="button" className="close" data-dismiss="alert">
          <span aria-hidden="true">&times;</span>
          <span className="sr-only">Close</span></button>
          <strong>Warning!</strong> Are you sure you want to change to the flash card methods from {oldMethod} to {newMethod}?  Doing so will reset all your existing statistics. <button className='btn btn-default' onClick={this.resetMethod} >OK, I want to change methods and delete all my stats</button>
          <button className='btn btn-default' style={{'marginLeft': '2px'}} onClick={this.cancelReset} >Cancel</button>
        </div>
      );
    }
  },

  handleRadioClick: function(e) {
    var val = e.target.value;
    this.setState({proposedRadioVal: val, warningVisible: true});
  },

  componentDidMount: function() {
    if (this.isMounted()) {
      var auth = JSON.parse(localStorage.getItem(localStorageKey));
      var userRef = ref.child('users').child(auth.uid);
      var settingsRef = userRef.child('settings');
      this.setState({settingsRef: settingsRef, userRef: userRef});
      var radioCheck = function(snapshot) {
        var settings = snapshot.val();
        if (!settings) {
          return;
        }
        if (settings.srs) {
          // Have to use yes/no object instead of simple boolean
          // in order to pass appropriate state to radio buttons
          var radioChecked = {
            yes: true,
            no: false
          };
          this.setState({radioChecked: radioChecked});
        } else if (settings.srs === false) {
          var radioChecked = {
            yes: false,
            no: true
          };
          this.setState({radioChecked: radioChecked});
        }
      };
      settingsRef.on('value', radioCheck, this);
    }
  },

  componentWillUnmount: function() {
    if (this.isMounted()) {
      this.state.settingsRef.off();
    }
  },

  render: function () {
    return (
      <div>
        <div className="page-header">
          <h2>Settings</h2>
        </div>
        <div>
          <div className="row">
            <div className="col-sm-10 col-xs-12">
              {this.renderWarning()}
            </div>
          </div>
          <div className="row">
            <div className="col-sm-10 col-xs-12">
              <form role="form" >
                <div className="form-group">
                  <label htmlFor="radio">Enable the Spaced Repetition System (SRS)</label>
                  <div>
                    <span className="srs-radio">
                      <input type="radio" name='srs' checked={this.state.radioChecked.yes} onChange={this.handleRadioClick}  value="yes"/> yes
                    </span>
                    <span className="srs-radio">
                      <input type="radio" checked={this.state.radioChecked.no} onChange={this.handleRadioClick} name='srs' value="no" /> no
                    </span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      );
  }
});

module.exports = Settings;
