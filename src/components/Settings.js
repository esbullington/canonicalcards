var React = require('react');
var Firebase = require('firebase');
var Authentication = require('./Authentication');
var constants = require('../constants/AppConstants');
var localStorageKey = constants.localStorageKey;
var ref = new Firebase("https://flashcardsapp.firebaseio.com/");

var Settings = React.createClass({

  mixins: [ Authentication ],

  getInitialState: function() {
    return {
      radioChecked: {yes: false, no: false},
      settingsRef: null
    };
  },

  handleSettingsError: function(error) {
    if (error) {
      console.log('Error: error saving settings, please try again');
    }
  },

  handleRadioClick: function(e) {
    var val = e.target.value;
    if (val === 'yes') {
      this.state.settingsRef.set({srs: true}, this.handleSettingsError);
      this.setState({radioChecked: true});
    } else if (val === 'no') {
      this.state.settingsRef.set({srs: false}, this.handleSettingsError);
      this.setState({radioChecked: false});
    }
    console.log('checked val: ', val);
  },

  componentDidMount: function() {
    if (this.isMounted()) {
      var auth = JSON.parse(localStorage.getItem(localStorageKey));
      var settingsRef = ref.child('users').child(auth.uid).child('settings');
      this.setState({settingsRef: settingsRef});
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
