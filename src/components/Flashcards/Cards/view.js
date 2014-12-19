var React = require('react');
var ReactPropTypes = React.PropTypes;
var Firebase = require('firebase');
var ref = new Firebase("https://flashcardsapp.firebaseio.com/");
var constants = require('constants/AppConstants');
var Result = require('./Result');
var Explanation = require('./Explanation');
var localStorageKey = constants.localStorageKey;
var authRef = require('../../auth');
var $ = window.jQuery;


var CardItem = React.createClass({

  render: function() {
    return (
        <div
          className="card-candidates-item"
          key={this.props.idx}
          // checkAnswerCallback is bound to the index in the calling component
          onClick={this.props.checkAnswerCallback}
        >
          <div className="card-candidates-item-inner">
            <span>{this.props.cardLetter}. </span>
            <label>
              <input
                type="radio"
                id="answerCandidate"
                name="candidates"
                value={this.props.idx}
                style={{"display":"none"}}
              />
               {this.props.el.text}
            </label> 
          </div>
        </div>
      );
  }

});

var CardGroup = React.createClass({

  getInitialState: function() {
    return {
      correctLetter: '',
      correctIndex: null,
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
      var counterRef = ref.child('users')
        .child(this.state.auth.uid)
        .child('stats')
        .child('flashcards')
        .child(hash);
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
      this.setState({locked: true});
    }
  },

  checkAnswerCallback: function(i) {
    if (this.state.settings && this.state.settings.srs) {
      this.checkSRSAnswer(i)
    } else {
      this.checkAnswer(i)
    }
  },

  getAlpha: function(i) {
    var alpha = {
      0 : 'A',
      1 : 'B',
      2 : 'C',
      3 : 'D',
      4 : 'E'
    };
    return alpha[i];
  },

  checkAnswer: function(i) {
    this.checkCardIndex();
    if (this.state.done) {
      return;
    };
    // We've pre-checked the array of answer candidates for the correct answer
    // So we only have to check if the pre-checked result is true
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

  checkSRSAnswer: function(i) {
    this.checkCardIndex();
    if (this.state.done) {
      return;
    };
    // We've pre-checked the array of answer candidates for the correct answer
    // So we only have to check if the pre-checked result is true
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
        this.advanceFrame();
      }
      this.advanceFrame();
    }
  },

  componentWillReceiveProps: function(props) {

    var done = props.done ? props.done: this.state.done;
    var locked = props.locked ? props.locked: this.state.locked;
    this.setState({done: done, locked: locked});

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
      var auth = JSON.parse(localStorage.getItem(localStorageKey)) || authRef.getAuth();
      if (auth && auth.uid) {
        this.setState({auth: auth});
        var settingsRef = ref.child('users').child(auth.uid).child('settings');
        settingsRef.once('value', function(snapshot) {
          var settings = snapshot.val();
          this.setState({settings: settings});
        }, this);
      }
      this.props.candidates.forEach(function(val, idx) {
        if (val.result) {
          this.setState({correctIndex: idx, correctLetter: this.getAlpha(idx)});
        }
      }, this);
    }
  },

  render: function() {

    var percentValue = (+this.props.cardIndex + 1) / +this.props.cardsLength * 100;

  	return (
      <div className="card-candidates container">

        <div className="top row">

        <div className="col-md-10 col-sm-8 col-xs-6">

          <div className="progress">
            <div className="progress-bar" role="progressbar" aria-valuenow={this.props.cardIndex + 1} aria-valuemin="0" aria-valuemax={this.props.cardsLength} style={{"width": percentValue + "%"}} >
              {"Question " + (+this.props.cardIndex + 1) + " out of " + this.props.cardsLength}
            </div>
          </div>

        </div>

        </div>
        
        <div className="row">

          <div className="col-md-11 col-sm-10 col-xs-10">
            <h3>{this.props.question.question}</h3>
            {this.props.candidates.map(function(el, idx) {
              return (
                  <CardItem
                    idx={idx}
                    checkAnswerCallback={this.checkAnswerCallback.bind(this, idx)}
                    el={el}
                    key={idx}
                    cardLetter={this.getAlpha(idx)}
                  />
                  )
              }, this)
            }

          </div>

          <div className="col-md-11 col-xs-10">

            <Result
              candidates={this.props.candidates}
              question={this.props.question}
              hash={this.props.hash}
              handleAdvanceFrame={this.handleAdvanceFrame}
              startTime={this.state.startTime}
              auth={this.state.auth}
              isCorrect={this.state.isCorrect}
              settings={this.state.settings}
              done={this.state.done}
              correctLetter={this.state.correctLetter}
              correctIndex={this.state.correctIndex}
            />

          </div>

        {/* end row */}
        </div>

      {/* end container */}
      </div>
    );
  },

});

module.exports = CardGroup;
