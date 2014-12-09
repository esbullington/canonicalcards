var React = require('react');
var FlashCardApp = require('./flashcards/FlashCardApp');

var Cards = React.createClass({
  render: function () {
    return <FlashCardApp />;
  }
});

module.exports = Cards;
