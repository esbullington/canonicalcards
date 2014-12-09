var React = require('react');
var Router = require('react-router');
var { Route, RouteHandler, Link } = Router;
var Login = require('./components/Login');
var Logout = require('./components/Logout');
var About = require('./components/About');
var Dashboard = require('./components/Dashboard');
var Settings = require('./components/Settings');
var App = require('./components/App');
var Cards = require('./components/Cards');

var routes = (
  <Route handler={App}>
    <Route name="login" handler={Login}/>
    <Route name="logout" handler={Logout}/>
    <Route name="about" handler={About}/>
    <Route name="dashboard" handler={Dashboard}/>
    <Route name="settings" handler={Settings}/>
    <Route name="cards" handler={Cards}/>
  </Route>
);

module.exports = routes;
