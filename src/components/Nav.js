var React = require('react');
var rb = require('react-bootstrap');
var Navbar = rb.Navbar;
var Nav = rb.Nav;
var NavItem = rb.NavItem;
var MenuItem = rb.MenuItem;
var DropdownButton = rb.DropdownButton;


      // <nav className="navbar navbar-inverse navbar-static-top" role="navigation">
      //     <div className="container">
      //         <div className="navbar-header">
      //             <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
      //                 <span className="sr-only">Toggle navigation</span>
      //                 <span className="icon-bar"></span>
      //                 <span className="icon-bar"></span>
      //                 <span className="icon-bar"></span>
      //             </button>
      //             <a className="navbar-brand" href="#">Start Bootstrap</a>
      //         </div>
      //         <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      //             <ul className="nav navbar-nav">
      //                 <li>
      //                     <a href="#">About</a>
      //                 </li>
      //                 <li>
      //                     <a href="#">Services</a>
      //                 </li>
      //                 <li>
      //                     <a href="#">Contact</a>
      //                 </li>
      //             </ul>
      //         </div>
      //     </div>
      // </nav>

var Nav = React.createClass({

  render: function() {
    return (
    <Navbar staticTop={true} inverse={true} role={"navigation"} >
    </Navbar>
      );
  }

});

module.exports = Nav;
