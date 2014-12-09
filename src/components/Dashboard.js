var React = require('react');
var Authentication = require('./Authentication');
var auth = require('./auth');

var Dashboard = React.createClass({

  mixins: [ Authentication ],

  render: function () {
    // var token = auth.getToken();
        // <p>{token}</p>
    return (
      <div>
        <h1>Dashboard</h1>
        <p>You made it!</p>
      </div>
    );
  }
});

module.exports = Dashboard;
