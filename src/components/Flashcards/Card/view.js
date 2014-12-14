var React = require('react');
var ReactPropTypes = React.PropTypes;
var Firebase = require('firebase');
var ref = new Firebase("https://flashcardsapp.firebaseio.com/");
var constants = require('constants/AppConstants');
var Formulas = require('./Formulas');
var Grades = require('./Grades');
var localStorageKey = constants.localStorageKey;
var authRef = require('../../auth');
var $ = window.jQuery;


var CardComponent = React.createClass({

  getInitialState: function() {
    return {
      locked: false,
      done: false,
      isCorrect: null,
      auth: null,
      settings: null,
      startTime: 0
    };
  },


  recordAnswer: function(hash, result) {
    var self = this;
    if (this.state.auth) {
      var counterRef = ref.child('users').child(this.state.auth.uid).child('stats').child('flashcards').child(hash);
      counterRef.once('value', function(snapshot) {
        var val = snapshot.val();
        var attemptedQuestions = val ? val.attemptedQuestions += 1: 1;
        if (result) {
          var correctQuestions = val? val.correctQuestions += 1: 1;
        } else {
          var correctQuestions = val ? val.correctQuestions: 0;
        }
        var hesitationInterval = (new Date().getTime()) - self.state.startTime;
        var hesitation = val && val.hesitation ? val.hesitation + ';' + hesitationInterval.toString() : hesitationInterval.toString();
        var toSave = {
          correctQuestions: correctQuestions,
          attemptedQuestions: attemptedQuestions,
          hesitation: hesitation
        };
        counterRef.set(toSave, function(error) {
          if (error) {
            console.log('error saving results');
          }
        });
      });
    }
  },

  checkCardIndex: function() {
    var cardIndex = +this.props.cardIndex;
    var cardsLength = +this.props.cardsLength - 1;
    if (cardIndex === cardsLength) {
      console.log('reached the end of the quiz');
      this.setState({locked: true});
    }
  },

  checkAnswer: function(e) {
    e.preventDefault;
    this.checkCardIndex();
    if (this.state.done) {
      return;
    };
    // We've pre-checked the array of answer candidates for the correct answer
    // So we only have to check if the pre-checked result is true
    var i = +e.target.value;
    var thisAnswerCandidate = this.props.candidates[i];
    if (thisAnswerCandidate.result) {
      this.setState({isCorrect: true});
      this.recordAnswer(this.props.hash, true);
    } else {
      this.setState({isCorrect: false});
      this.recordAnswer(this.props.hash, false);
    }
    this.setState({done: true});
  },

  checkSRSAnswer: function(e) {
    e.preventDefault;
    this.checkCardIndex();
    if (this.state.done) {
      return;
    };
    // We've pre-checked the array of answer candidates for the correct answer
    // So we only have to check if the pre-checked result is true
    var i = +e.target.value;
    var thisAnswerCandidate = this.props.candidates[i];
    if (thisAnswerCandidate.result) {
      this.setState({isCorrect: true});
    } else {
      this.setState({isCorrect: false});
    }
    this.setState({done: true});
  },

  advanceFrame: function() {
    if (this.state.locked) {
      this.props.handleEndModal();
      console.log('End of quiz');
    } else {
      this.setState({done: false, isCorrect: false});
      $('.carousel').carousel('next');
    }
  },

  handleAdvanceFrame: function(e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if (this.state.done) {
      if(code === 32) {
        console.log("Pressed the Space key.");
        this.advanceFrame();
      }
      this.advanceFrame();
    }
  },

  componentWillUnmount: function() {
    window.removeEventListener('keypress', this.handleAdvanceFrame);
  },

  componentDidMount: function() {
    var uid;
    if (this.isMounted()) {
      window.addEventListener('keypress', this.handleAdvanceFrame);
      var now = new Date();
      this.setState({startTime: now.getTime()});
      var auth = JSON.parse(localStorage.getItem(localStorageKey));
      if (auth) {
        this.setState({auth: auth});
        uid = auth.uid;

      } else {
        auth = authRef.getAuth();
        uid = auth.uid;
        this.setState({auth: auth});
      }
      var settingsRef = ref.child('users').child(uid).child('settings');
      settingsRef.once('value', function(snapshot) {
        var settings = snapshot.val();
        this.setState({settings: settings});
      }, this);
    }
  },


  renderResult: function() {
    var answer = this.props.question.answer;
    var explanation = this.props.question.explanation ? this.props.question.explanation : '';
    if (this.state.done && this.state.settings) {
      // First, the render right/wrong paths for those not wanting SRS
      if (!this.state.settings.srs && this.state.isCorrect) {
        return (
            <div>
              <div>Right! {explanation}
                <span className="explanation">{explanation}</span>
                <Formulas formula={this.props.question.formula} />
              </div>
              <button onClick={this.handleAdvanceFrame} className="btn btn-default">Next</button>
            </div>
          );
      } else if (!this.state.settings.srs) {
        return (
            <div>
              <div>Incorrect. The correct answer is: {answer}.
                <span className="explanation">{explanation}</span>
                <Formulas formula={this.props.question.formula} />
              </div>
              <button onClick={this.handleAdvanceFrame} className="btn btn-default">Next</button>
            </div>
          );
      }
      // For SRS results
      if (this.state.settings.srs && this.state.isCorrect) {
        var isCorrect = this.state.isCorrect;
        return (
            <div>
              <div>Right!
                <span className="explanation">{explanation}</span>
                <Formulas formula={this.props.question.formula} />
              </div>
              <Grades
                startTime={this.state.startTime}
                auth={this.state.auth}
                hash={this.props.hash}
                handleAdvanceFrame={this.handleAdvanceFrame}
                isCorrect={isCorrect}
              />
            </div>
          );
      } else if (this.state.settings.srs) {
        return (
            <div>
              <div>Incorrect. The correct answer is: {answer}.
                <span className="explanation">{explanation}</span>
                <Formulas formula={this.props.question.formula} />
              </div>
              <Grades
                startTime={this.state.startTime}
                auth={this.state.auth}
                hash={this.props.hash}
                handleAdvanceFrame={this.handleAdvanceFrame}
                isCorrect={isCorrect}
              />
            </div>
          );
      }
    }
  },

  render: function() {

  	return (
      <div>
        {this.props.candidates.map(function(el, idx) {
          return (
            <div key={idx} >
              <label>
                <input onClick={ this.state.settings && this.state.settings.srs ? this.checkSRSAnswer : this.checkAnswer } type="radio" id="possibleAnswers" name="candidates" value={idx} style={{"display":"none"}} />
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

module.exports = CardComponent;
