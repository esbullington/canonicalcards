var React = require('react');
var Authentication = require('./Authentication');
var auth = require('./auth');

var Dashboard = React.createClass({
  mixins: [ Authentication ],

  render: function () {
    var token = auth.getToken();
    return (
      <div>
        <h1>Dashboard</h1>
        <p>You made it!</p>
        <p>{token}</p>
      </div>
    );
  }
});

module.exports = Dashboard;
