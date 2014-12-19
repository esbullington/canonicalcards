'use strict';

var React = require('react');
var PubSub = require('pubsub-js');
var EventTypes = require('constants/EventTypes');
var DEAL_CARDS = EventTypes.DEAL_CARDS;

var EndModal = React.createClass({

    killClick: function(e) {
        // clicks on the content shouldn't close the modal
        e.stopPropagation();
    },

    style: {
      'margin': '10px 10px 0px'
    },

    handleCardClick: function(e) {
      PubSub.publish(DEAL_CARDS, "deal'em");

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
                        <label for="exampleInputEmail1">Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" />
                      </div>
                      <button type="submit" className="btn btn-default">Submit</button>
                    </form>


                  </div>

                </div>

              </div>
            </div>
          </div>
        );
    }
});


module.exports = EndModal;
