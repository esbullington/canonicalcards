var React = require('react');
var Flashcards = require('./Flashcards');

var Cards = React.createClass({
  render: function () {
    return (
      <Flashcards 
        banner="Dashboard" 
        bannerlink="dashboard" 
        modalType="endmodal"
      />
    );
  }
});

module.exports = Cards;
