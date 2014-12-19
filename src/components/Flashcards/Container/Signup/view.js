'use strict';

var React = require('react');
var PubSub = require('pubsub-js');
var config = require('config/AppConfig');
var Firebase = require('firebase');
var ref = new Firebase(config.firebase);
var EventTypes = require('constants/EventTypes');
var DEAL_CARDS = EventTypes.DEAL_CARDS;

var EndModal = React.createClass({

  getInitialState: function() {
    return {
      done: false
    }
  },

    killClick: function(e) {
        // clicks on the content shouldn't close the modal
        e.stopPropagation();
    },

    style: {
      'margin': '10px 10px 0px'
    },

    handleForm: function(e) {
      e.preventDefault();
      var email = this.refs.email.getDOMNode().value;
      var onError =  function(error) {
        if (!error) {
          // No error, say thank you and redeal quiz cards
          this.setState({done: true});
          setTimeout(function() {
            PubSub.publish(DEAL_CARDS, "deal'em");
          }, 2000);
        } else {
          // Error occurred
          console.log('error saving email');
        }
      };

      ref.child('emails').push(email, onError.bind(this));
    },

    render: function() {
        return (
          <div className="modal-backdrop" >
            <div className="modal-content" onClick={this.killClick}>
              <div style={this.style} className="modal-choices">

                <h2>End of Quiz</h2>

                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h3 className="panel-title">Sign up for more:</h3>
                  </div>

                  <div className="panel-body">

                    <form role="form">
                      <div className="form-group">
                        <label htmlFor="emailInput">Email address</label>
                        <input type="email" ref="email" className="form-control" id="emailInput" placeholder="Enter email" />
                      </div>
                      <button type="submit" onClick={this.handleForm} className="btn btn-default">Submit</button>
                    </form>

                    <div>{this.state.done ? "Thank you!" : ""}</div>


                  </div>

                </div>

              </div>
            </div>
          </div>
        );
    }
});


module.exports = EndModal;
