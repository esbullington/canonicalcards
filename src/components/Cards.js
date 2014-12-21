var React = require('react');
var Flashcards = require('./Flashcards');

var Cards = React.createClass({
  render: function () {
    return (
      <Flashcards 
        modalType="signup"
      />
    );
  }
});

module.exports = Cards;
