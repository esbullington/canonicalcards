var React = require('react');
var Flashcards = require('./Flashcards');

var Cards = React.createClass({
  render: function () {
    return (
      <Flashcards 
        banner="About" 
        bannerlink="/" 
        modalType="signup"
      />
    );
  }
});

module.exports = Cards;
