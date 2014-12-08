var React = require('react');
var FlashCardActions = require('../actions/FlashCardActions');

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

  /**
   * Event handler called within FlashCardTextInput.
   * Defining this here allows FlashCardTextInput to be used in multiple places
   * in different ways.
   * @param {string} text
   */
  _onSave: function(text) {
    if (text.trim()){
      FlashCardActions.create(text);
    }

  }

});

module.exports = Header;
