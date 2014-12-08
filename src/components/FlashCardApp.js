var Footer = require('./Footer');
var Header = require('./Header');
var MainSection = require('./MainSection');
var React = require('react');
var FlashCardStore = require('../stores/FlashCardStore');

/**
 * Retrieve the current FLASHCARD data from the FlashCardStore
 */
function getFlashCardState() {
  return {
    allFlashCards: FlashCardStore.getAll()
  };
}

var FlashCardApp = React.createClass({

  getInitialState: function() {
    return getFlashCardState();
  },

  componentDidMount: function() {
    FlashCardStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    FlashCardStore.removeChangeListener(this._onChange);
  },

  /**
   * @return {object}
   */
  render: function() {
  	return (
      <div>
        <Header />
        <MainSection
          allFlashCards={this.state.allFlashCards}
        />
        <Footer allFlashCards={this.state.allFlashCards} />
      </div>
  	);
  },

  /**
   * Event handler for 'change' events coming from the FlashCardStore
   */
  _onChange: function() {
    this.setState(getFlashCardState());
  }

});

module.exports = FlashCardApp;
