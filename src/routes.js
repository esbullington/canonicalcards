var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link, DefaultRoute, NotFoundRoute } = Router;
var Login = require('./components/Login');
var Logout = require('./components/Logout');
var Register = require('./components/Register');
var About = require('./components/About');
var Dashboard = require('./components/Dashboard');
var Settings = require('./components/Settings');
var App = require('./components/App');
var Cards = require('./components/flashcards/CardContainer');
var Display = require('./components/Display');
var NotFound = require('./components/NotFound');

var routes = (
  <Route handler={App}  >
    <DefaultRoute handler={Login}/>
    <Route name="cards" handler={Cards}/>
    <Route name="display"  handler={Display} >
      <Route name="login" handler={Login}/>
      <Route name="logout" handler={Logout}/>
      <Route name="register" handler={Register}/>
      <Route name="about" handler={About}/>
      <Route name="dashboard" handler={Dashboard}/>
      <Route name="settings" handler={Settings}/>
    </Route>
    <NotFoundRoute handler={Login}/>
  </Route>
);

module.exports = routes;
