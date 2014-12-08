var React = require('react');

var Header = React.createClass({

  /**
   * @return {object}
   */
  render: function() {
    return (
      <header className="row" id="header">
        <div className="col-md-12" >
          <h1>Flashcard App</h1>
        </div>
      </header>
    );
  },

});

module.exports = Header;
