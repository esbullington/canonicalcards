var React = require('react');
var Flashcards = require('./Flashcards');

var Home = React.createClass({
  render: function () {
    return (
      <Flashcards 
        banner="Learn more!" 
        bannerlink="about" 
        modalType="signup"
      />
    );
  }
});

module.exports = Home;
