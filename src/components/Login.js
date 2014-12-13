var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;
var auth = require('./auth');

var Login = React.createClass({

  mixins: [ Router.Navigation ],

  statics: {
    attemptedTransition: null
  },

  getInitialState: function () {
    return {
      error: false
    };
  },

  handleSubmit: function (event) {
    event.preventDefault();
    var email = this.refs.email.getDOMNode().value;
    var password = this.refs.password.getDOMNode().value;
    var user = {
      email: email,
      password: password
    };
    auth.login(user, function (error, authData) {
      if (error) {
        return this.setState({ error: true });
      }
      if (Login.attemptedTransition) {
        var transition = Login.attemptedTransition;
        Login.attemptedTransition = null;
        transition.retry();
      } else {
        this.replaceWith('/display/dashboard');
      }
    }.bind(this));
  },

  render: function () {
    var errors = this.state.error ? <p>Bad login information</p> : '';
    return (
      <div className="col-md-4">
        <div className="panel panel-default">
          <div className="panel-heading"><h3 className="panel-title"><strong>Sign In </strong></h3></div>
            <div className="panel-body">
              <form role="form" onSubmit={this.handleSubmit} >
                <div className="form-group">
                  <label htmlFor="inputEmail">Username or Email</label>
                  <input type="email" className="form-control" ref="email" id="inputEmail" placeholder="Enter email" />
                </div>
                <div className="form-group">
                  <label htmlFor="inputPassword">Password <a href="/sessions/forgot_password">(forgot password)</a>
                  </label>
                  <input type="password" ref="password" className="form-control" id="inputPassword1" placeholder="Password"/>
                </div>
                <button type="submit" className="btn btn-sm btn-default">Sign in</button>
              </form>
            </div>
        </div>
      </div>
    );
  }
});


module.exports = Login;
