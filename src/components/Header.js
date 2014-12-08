var React = require('react');
var FlashCardActions = require('../actions/FlashCardActions');

var Header = React.createClass({

  /**
   * @return {object}
   */
  render: function() {
    return (
      <header id="header">
        <h1>todos</h1>
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
