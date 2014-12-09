var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;
var auth = require('./auth');

var Register = React.createClass({

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
    var password = this.refs.password.getDOMNode().value;
    var repeatPassword = this.refs.repeatPassword.getDOMNode().value;
    if (password != repeatPassword) {
      this.setState({error: true});
      return false;
    }
    var user = {
      email: this.refs.email.getDOMNode().value,
      password: this.refs.password.getDOMNode().value
    };
    auth.createUser(user, function (error, authData) {
      if (error) {
        return this.setState({ error: true });
      }
      if (Register.attemptedTransition) {
        var transition = Register.attemptedTransition;
        Register.attemptedTransition = null;
        transition.retry();
      } else {
        this.replaceWith('/cards');
      }
    }.bind(this));
  },

  render: function () {
    var errors = this.state.error ? <p>Bad login information</p> : '';
    return (
      <div className="col-md-4">
        <div className="panel panel-default">
          <div className="panel-heading"><h3 className="panel-title"><strong>Register New User</strong></h3></div>
            <div className="panel-body">
              <form role="form" onSubmit={this.handleSubmit} >
                <div className="form-group">
                  <label htmlFor="inputEmail">Email</label>
                  <input type="email" className="form-control" ref="email" id="inputEmail" placeholder="Enter email" />
                </div>
                <div className="form-group">
                  <label htmlFor="inputPassword">Password
                  </label>
                  <input type="password" ref="password" className="form-control" id="inputPassword" placeholder="Password"/>
                </div>
                <div className="form-group">
                  <label htmlFor="repeatPassword">Password (Again)
                  </label>
                  <input type="password" ref="repeatPassword" className="form-control" id="repeatPassword" placeholder="Repeat Password"/>
                </div>
                <button type="submit" className="btn btn-sm btn-default">Sign in</button>
              </form>
            </div>
        </div>
      </div>
    );
  }
});


module.exports = Register;
