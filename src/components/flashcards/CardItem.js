var React = require('react');
var ReactPropTypes = React.PropTypes;
var Firebase = require('firebase');
var ref = new Firebase("https://flashcardsapp.firebaseio.com/");
var constants = require('../../constants/AppConstants');
var localStorageKey = constants.localStorageKey;
var spacedRepetition = require('./spacedRepetition');
var authRef = require('../auth');
var $ = window.jQuery;


function getRepIntervalAndQuestionDate(attemptedQuestions, grade, val) {
  var repIntervalAndQuestionDate;
  var lastRepetitionInterval = val ? val.lastRepetitionInterval: 1;
  var easinessFactor = val && val.easinessFactor ? val.easinessFactor: 2.5;
  var i = spacedRepetition.getNextRepetitionInterval(attemptedQuestions, grade, lastRepetitionInterval, easinessFactor);
  var today = new Date();
  var nextQuestionDate = today.getTime() + (24*60*60*1000*i); 
  repIntervalAndQuestionDate = {
    lastRepetitionInterval: i,
    nextQuestionDate: nextQuestionDate
  };
  return repIntervalAndQuestionDate;
}

var CardItem = React.createClass({

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

  recordSRSAnswer: function(hash, result, grade) {
    var self = this;
    if (this.state.auth) {
      console.log('Recording SRS answer');
      var counterRef = ref.child('users').child(this.state.auth.uid).child('stats').child('srs').child(hash);
      counterRef.once('value', function(snapshot) {
        var val = snapshot.val();
        var attemptedQuestions = val ? val.attemptedQuestions += 1: 1;
        if (result) {
          var correctQuestions = val? val.correctQuestions += 1: 1;
        } else {
          var correctQuestions = val ? val.correctQuestions: 0;
        }
        var o = getRepIntervalAndQuestionDate(attemptedQuestions, grade, val);
        var hesitationInterval = (new Date().getTime()) - self.state.startTime;
        var hesitation = val && val.hesitation ? val.hesitation + ';' + hesitationInterval.toString() : hesitationInterval.toString();
        var toSave = {
          correctQuestions: correctQuestions,
          attemptedQuestions: attemptedQuestions,
          lastRepetitionInterval: o.lastRepetitionInterval,
          nextQuestionDate: o.nextQuestionDate,
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

  recordAnswer: function(hash, result) {
    var self = this;
    if (this.state.auth) {
      console.log('Recording answer');
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
      console.log('End of quiz, quiz locked');
    }
    this.setState({done: false, isCorrect: false});
    $('.carousel').carousel('next');
  },

  componentDidMount: function() {
    var uid;
    if (this.isMounted()) {
      // MathJax.Hub.Queue(["Typeset",MathJax.Hub,root]);
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

  // componentDidUpdate: function (props,state,root) {
  //   MathJax.Hub.Queue(["Typeset",MathJax.Hub,root]);
  // },


  checkGrade: function(e) {
    e.preventDefault;
    var grade = +e.target.value;
    if (this.state.isCorrect !== null) {
      this.recordSRSAnswer(this.props.hash, this.state.isCorrect, grade);
      this.advanceFrame();
    }
  },

  renderGrades: function(isCorrect) {
    var correctGrades = {
      3: 'correct response recalled with serious difficulty',
      4: 'correct response after a hesitation',
      5: 'perfect response'
    };
    var incorrectGrades = {
      0: 'complete blackout',
      1: 'incorrect response; the correct one remembered',
      2: 'incorrect response; where the correct one seemed easy to recall',
    };
    if (isCorrect) {
      return (
          <div>
          {Object.keys(correctGrades).map(function(val, idx) {
            return (
              <div key={idx} >
                <label>
                  <input onClick={this.checkGrade} type="radio" id="possibleGrades" name="grades" value={val} style={{"display":"none"}} />
                  {correctGrades[val]}
                </label> 
              </div>
                )
            }, this)
          }
          </div>
        );
    } else {
      return (
          <div>
          {Object.keys(incorrectGrades).map(function(val, idx) {
            return (
              <div key={idx} >
                <label>
                  <input onClick={this.checkGrade} type="radio" id="possibleGrades" name="grades" value={val} style={{"display":"none"}} />
                  {incorrectGrades[val]}
                </label> 
              </div>
                )
            }, this)
          }
          </div>
        );
    }
  },

  renderResult: function() {
    var answer = this.props.question.answer;
    var explanation = this.props.question.explanation ? this.props.question.explanation : '';
    var formula = this.props.question.formula ? this.props.question.formula : '';
    if (this.state.done && this.state.settings) {
      // First, the render right/wrong paths for those not wanting SRS
      if (!this.state.settings.srs && this.state.isCorrect) {
        return (
            <div>
              <div>Right! {explanation}
                  <span className="explanation">{explanation}</span>
                  <img src={"data:image/png;base64," + formula} />
              </div>
              <button onClick={this.advanceFrame} className="btn btn-default">Next</button>
            </div>
          );
      } else if (!this.state.settings.srs) {
        return (
            <div>
              <div>Incorrect. The correct answer is: {answer}.
                <span className="explanation">{explanation}</span>
                <img src={"data:image/png;base64," + formula} />
              </div>
              <button onClick={this.advanceFrame} className="btn btn-default">Next</button>
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
                <img src={"data:image/png;base64," + formula} />
              </div>
              {this.renderGrades(isCorrect)}
            </div>
          );
      } else if (this.state.settings.srs) {
        return (
            <div>
              <div>Incorrect. The correct answer is: {answer}.
                <span className="explanation">{explanation}</span>
                <img src={"data:image/png;base64," + formula} />
              </div>
              {this.renderGrades(isCorrect)}
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

module.exports = CardItem;
