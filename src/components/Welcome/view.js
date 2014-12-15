'use strict';

var React = require('react');
var Firebase = require('firebase');
var ref = new Firebase('https://flashcardsapp.firebaseio.com');
var Router = require('react-router');
var Link = Router.Link;


var OPTIONS = [
  {
    name: 'cards',
    title: 'Cards',
    icon: '',
    description: 'Begin a new learning session'
  },
  {
    name: 'dashboard',
    title: 'Dashboard',
    icon: '',
    description: 'View your stats'
  }
];

var WelcomeItem = React.createClass({

  render: function() {
    return (
      <Link to={this.props.item.name} className="list-group-item">
        <h4 className="list-group-item-heading">{this.props.item.title}</h4>
        <p className="list-group-item-text">{this.props.item.description}</p>
      </Link>
      );
  }

});

var Welcome = React.createClass({


  render: function () {
    return (
      <div className="card-container">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <h3 className="page-header">Please select an activity:</h3>
              <div className="welcome-screen list-group">
                {OPTIONS.map(function(val, idx) {
                    return <WelcomeItem item={val} key={idx} />;
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Welcome;
