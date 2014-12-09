var React = require('react');
var ReactPropTypes = React.PropTypes;
var $ = window.jQuery;

var CardItem = React.createClass({

  getInitialState: function() {
    return {
      done: false
    };
  },

  checkAnswer: function(e) {
    e.preventDefault;
    var i = +e.target.value;
    if (this.props.answers[i].result) {
      console.log('Answer is: ', true);
    } else {
      console.log('Answer is: ', false);
    }
    this.setState({done: true});
  },

  advanceFrame: function(e) {
    console.log('clicked!');
    $('.carousel').carousel('next');
  },

  renderResult: function() {
    if (this.state.done) {
      return (
          <button onClick={this.advanceFrame} className="btn btn-default">Next</button>
        );
    }
  },

  render: function() {

  	return (
      <div>
        {this.props.answers.map(function(el, idx) {
          return (
            <div key={idx} >
              <label>
                <input onClick={this.checkAnswer} type="radio" id="possibleAnswers" name="answers" value={idx} style={{"display":"none"}} />
                {el.text}
              </label> 
            </div>
              )
          }, this)
        }

        {this.renderResult()}

      </div>
    );
  },

});

module.exports = CardItem;
