var React = require('react');
var ReactPropTypes = React.PropTypes;
var FlashCardActions = require('../actions/FlashCardActions');

var Footer = React.createClass({

  propTypes: {
    allFlashCards: ReactPropTypes.object.isRequired
  },

  /**
   * @return {object}
   */
  render: function() {
    var allFlashCards = this.props.allFlashCards;
    var total = Object.keys(allFlashCards).length;

    if (total === 0) {
      return null;
    }

    var completed = 0;
    for (var key in allFlashCards) {
      if (allFlashCards[key].complete) {
        completed++;
      }
    }

    var itemsLeft = total - completed;
    var itemsLeftPhrase = itemsLeft === 1 ? ' item ' : ' items ';
    itemsLeftPhrase += 'left';

    // Undefined and thus not rendered if no completed items are left.
    var clearCompletedButton;
    if (completed) {
      clearCompletedButton =
        <button
          id="clear-completed"
          onClick={this._onClearCompletedClick}>
          Clear completed ({completed})
        </button>;
    }

  	return (
      <footer id="footer">
        <span id="todo-count">
          <strong>
            {itemsLeft}
          </strong>
          {itemsLeftPhrase}
        </span>
        {clearCompletedButton}
      </footer>
    );
  },

  /**
   * Event handler to delete all completed FLASHCARDs
   */
  _onClearCompletedClick: function() {
    FlashCardActions.destroyCompleted();
  }

});

module.exports = Footer;
