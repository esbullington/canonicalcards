var React = require('react');
var ReactPropTypes = React.PropTypes;
var Firebase = require('firebase');
var ref = new Firebase("https://flashcardsapp.firebaseio.com/");
var constants = require('constants/AppConstants');
var Result = require('./Result');
var localStorageKey = constants.localStorageKey;
var authRef = require('../../auth');
var $ = window.jQuery;


var CardItem = React.createClass({

  getInitialState: function() {
    return {
      inputState: ''
    };
  },

  render: function() {
  }

});

var CardGroup = React.createClass({

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
      console.log("You've reached the end of the quiz");
      this.setState({locked: true});
    }
  },

  checkAnswerCallback: function(key) {
    if (this.state.settings && this.state.settings.srs) {
      this.checkSRSAnswer(key)
    } else {
      this.checkAnswer(key)
    }
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

  handleClick: function(e) {
  },

  componentWillReceiveProps: function(props) {

    var done = props.done ? props.done: this.state.done;
    var locked = props.locked ? props.locked: this.state.locked;
    this.setState({done: done, locked: locked});

  },

  componentWillUnmount: function() {
    window.removeEventListener('keypress', this.handleAdvanceFrame);
    document.removeEventListener("click", this.handleClick, false);
  },

  componentDidMount: function() {
    var uid;
    if (this.isMounted()) {
      window.addEventListener('keypress', this.handleAdvanceFrame);
      document.addEventListener("click", this.handleClick, false);
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
    }
  },

  render: function() {

    var percentValue = (+this.props.cardIndex + 1) / +this.props.cardsLength * 100;

  	return (
      <div className="card-candidates container">
        <div className="row">

        <div className="col-md-10 col-sm-8 col-xs-6">
          <div className="progress">
            <div className="progress-bar" role="progressbar" aria-valuenow={this.props.cardIndex + 1} aria-valuemin="0" aria-valuemax={this.props.cardsLength} style={{"width": percentValue + "%"}} >
              {"Question " + (+this.props.cardIndex + 1) + " out of " + this.props.cardsLength}
            </div>
          </div>
        </div>

        </div>
        
        <div className="row">

          <div className="col-md-12">
            <h3>{this.props.question.question}</h3>
            {this.props.candidates.map(function(el, idx) {
              return (
                <div
                  className="card-candidates-item"
                  key={idx}
                  onClick={this.checkAnswerCallback.bind(this, idx)}
                >
                  <div className="card-candidates-item-inner">
                    <label>
                      <input
                        ref={"answerCandidate" + idx}
                        type="radio"
                        id="answerCandidate"
                        name="candidates"
                        value={idx}
                        style={{"display":"none"}}
                      />
                      {el.text}
                    </label> 
                  </div>
                </div>
                  )
              }, this)
            }

          </div>

          <div className="col-md-12">

            <Result
              question={this.props.question}
              hash={this.props.hash}
              handleAdvanceFrame={this.handleAdvanceFrame}
              startTime={this.state.startTime}
              auth={this.state.auth}
              isCorrect={this.state.isCorrect}
              settings={this.state.settings}
              done={this.state.done}
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
