var MainSection = require('./MainSection');
var CardContainer = require('./CardContainer');
var React = require('react');


var FlashCardApp = React.createClass({

  getInitialState: function() {
    return {allFlashCards: []}
  },

  render: function() {
  	return (
      <div>
        <CardContainer />
        <MainSection
          allFlashCards={this.state.allFlashCards}
        />
      </div>
  	);
  },

});

module.exports = FlashCardApp;
