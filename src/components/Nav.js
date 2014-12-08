var React = require('react');

var NAV_LINKS = [
  {
    name: 'hd.payment',
    title: 'Payment'
  },
  {
    name: 'hd.dashboard',
    title: 'Dashboard'
  },
  {
    name: 'hd.about',
    title: 'About'
  },
  {
    name: 'hd.settings',
    title: 'Settings'
  },
  {
    name: 'hd.logout',
    title: 'Logout'
  }
];

var LOGIN_LINKS = [
  {
    name: 'hd.login',
    title: 'Login'
  },
  {
    name: 'hd.about',
    title: 'About'
  },
  {
    name: 'hd.register',
    title: 'Register New Account'
  }
];


var Nav = React.createClass({

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
                  <a className="navbar-brand" href="#">Start Bootstrap</a>
              </div>
              <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul className="nav navbar-nav">
                      <li>
                          <a href="#">About</a>
                      </li>
                      <li>
                          <a href="#">Services</a>
                      </li>
                      <li>
                          <a href="#">Contact</a>
                      </li>
                  </ul>
              </div>
          </div>
      </nav>
      );
  }

            // {/* We only check local auth. state for proper menu, not to display potentially sensitive user data*/}
            // { (this.props.loggedIn) ? 
            //   NAV_LINKS.map( function(el) {
            //    return this.renderNavItem(el);
            //  }, this) :
            //   LOGIN_LINKS.map( function(el) {
            //    return this.renderNavItem(el);
            //  }, this)
            // }
});

module.exports = Nav;
