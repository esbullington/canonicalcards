var React = require('react');
var ReactPropTypes = React.PropTypes;

var Footer = React.createClass({

  render: function() {

  	return (
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <p>Copyright © Your Website 2014</p>
            </div>
          </div>
        </div>
      </footer>
    );
  },

});

module.exports = Footer;
