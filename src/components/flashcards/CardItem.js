var React = require('react');
var ReactPropTypes = React.PropTypes;
var $ = window.jQuery;

var CardItem = React.createClass({

  getInitialState: function() {
    return {
      done: false,
      isCorrect: false
    };
  },

  checkAnswer: function(e) {
    e.preventDefault;
    var i = +e.target.value;
    if (this.props.candidates[i].result) {
      this.setState({isCorrect: true});
      console.log('Answer is: ', true);
    } else {
      console.log('Answer is: ', false);
      this.setState({isCorrect: false});
    }
    this.setState({done: true});
  },

  advanceFrame: function(e) {
    this.setState({done: false, isCorrect: false});
    console.log('clicked!');
    $('.carousel').carousel('next');
  },

  renderResult: function() {
    if (this.state.done && this.state.isCorrect) {
      return (
      <div>
        <div>Right!</div>
        <button onClick={this.advanceFrame} className="btn btn-default">Next</button>
      </div>
        );
    } else if (this.state.done) {
      return (
      <div>
        <div>Wrong!</div>
        <button onClick={this.advanceFrame} className="btn btn-default">Next</button>
      </div>
      );
    }
  },

  render: function() {

  	return (
      <div>
        {this.props.candidates.map(function(el, idx) {
          return (
            <div key={idx} >
              <label>
                <input onClick={this.checkAnswer} type="radio" id="possibleAnswers" name="candidates" value={idx} style={{"display":"none"}} />
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
