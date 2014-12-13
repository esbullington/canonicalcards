var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;
var auth = require('./auth');

var NAV_LINKS = [
  {
    name: 'cards',
    title: 'Cards'
  },
  {
    name: 'dashboard',
    title: 'Dashboard'
  },
  {
    name: 'settings',
    title: 'Settings'
  },
  {
    name: 'logout',
    title: 'Logout'
  }
];

var LOGIN_LINKS = [
  {
    name: 'login',
    title: 'Login'
  },
  {
    name: 'register',
    title: 'Register'
  },
  {
    name: 'about',
    title: 'About'
  }
];


var Nav = React.createClass({

  getInitialState: function() {
    return {
      activePage: ''
    }
  },

  renderNavItem: function (link) {
    return (
        <li className={this.state.activePage === link.name ? 'active' : ''} key={link.name}>
          <Link data-link-name={link.name} to={link.name} >{link.title}</Link>
        </li>
      );
  },


  render: function() {
    return (
      <nav className="navbar navbar-inverse navbar-static-top" role="navigation">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="/">Start Bootstrap</a>
          </div>
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              {/* We only check local auth. state for proper menu, not to display potentially sensitive user data*/}
              { (this.props.loggedIn) ? 
                NAV_LINKS.map( function(el) {
                 return this.renderNavItem(el);
               }, this) :
                LOGIN_LINKS.map( function(el) {
                 return this.renderNavItem(el);
               }, this)
              }
            </ul>
          </div>
        </div>
      </nav>
      );
  }

});

module.exports = Nav;
