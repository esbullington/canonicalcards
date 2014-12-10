var React = require('react');
var ReactPropTypes = React.PropTypes;
var Firebase = require('firebase');
var constants = require('../../constants/AppConstants');
var localStorageKey = constants.localStorageKey;
var ref = new Firebase("https://flashcardsapp.firebaseio.com/");
var $ = window.jQuery;

var CardItem = React.createClass({

  getInitialState: function() {
    return {
      done: false,
      isCorrect: false,
      auth: null 
    };
  },

  recordAnswer: function(hash, result) {
    console.log('hash', hash)
    console.log('result', result)
    console.log('auth', this.state.auth)
    if (this.state.auth) {
      var counterRef = ref.child('users').child(this.state.auth.uid).child(hash);
      counterRef.once('value', function(snapshot) {
        var val = snapshot.val();
        var attemptedQuestions = val ? val.attemptedQuestions += 1: 1;
        if (result) {
          var correctQuestions = val? val.correctQuestions += 1: 1;
        } else {
          var correctQuestions = val ? val.correctQuestions: 0;
        }
        var toSave = {
          correctQuestions: correctQuestions,
          attemptedQuestions: attemptedQuestions
        };
        counterRef.set(toSave, function(error) {
          if (error) {
            console.log('error saving results');
          }
        });
      });
    }
  },

  checkAnswer: function(e) {
    e.preventDefault;
    var i = +e.target.value;
    // We've pre-checked the array of answer candidates for the correct answer
    // So we only have to check if the pre-checked result is true
    var thisAnswerCandidate = this.props.candidates[i];
    if (thisAnswerCandidate.result) {
      this.setState({isCorrect: true});
      this.recordAnswer(this.props.question.hash, true);
      console.log('Answer is: ', true);
    } else {
      console.log('Answer is: ', false);
      this.recordAnswer(this.props.question.hash, false);
      this.setState({isCorrect: false});
    }
    this.setState({done: true});
  },

  advanceFrame: function(e) {
    this.setState({done: false, isCorrect: false});
    console.log('clicked!');
    $('.carousel').carousel('next');
  },

  componentDidMount: function() {
    if (this.isMounted()) {
      var auth = JSON.parse(localStorage.getItem(localStorageKey));
      this.setState({auth: auth});
    }
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
