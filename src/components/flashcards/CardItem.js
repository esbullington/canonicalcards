var React = require('react');
var ReactPropTypes = React.PropTypes;

var CardItem = React.createClass({

  checkAnswer: function(e) {
    console.log(e.value);
    if (this.props.answers[i].result) {
      console.log('Answer is: ', true);
      return true;
    } else {
      console.log('Answer is: ', false);
      return false;
    }
  },

  render: function() {

  	return (
      <div>
        <ul>
        {this.props.answers.map(function(el, idx) {
          return (
            <li onClick={this.checkAnswer} key={idx} >{el.text}</li>
            )
          }, this)
        }
        </ul>
      </div>
    );
  },

});

module.exports = CardItem;
