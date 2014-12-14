'use strict';

var React = require('react');

var EndModal = React.createClass({

    killClick: function(e) {
        // clicks on the content shouldn't close the modal
        e.stopPropagation();
    },

    style: {
      'margin': '10px 10px 0px'
    },

    render: function() {
        return (
          <div className="modal-backdrop" >
            <div className="modal-content" onClick={this.killClick}>
              <div style={this.style} className="modal-choices">

                <h2>End of Quiz</h2>

                <div className="panel panel-default">
                  <div className="panel-heading">
                    <h3 className="panel-title">Would you like to:</h3>
                  </div>

                  <div className="panel-body">

                    <div className="list-group">
                      <a href="#/display/cards" className="list-group-item">Review the next group</a>
                      <a href="#/display/dashboard" className="list-group-item">View your current statistics</a>
                      <a href="#/display/settings" className="list-group-item">Review app settings</a>
                      <a href="#/display/logout" className="list-group-item">Logout</a>
                    </div>

                  </div>

                </div>

              </div>
            </div>
          </div>
        );
    }
});


module.exports = EndModal;
