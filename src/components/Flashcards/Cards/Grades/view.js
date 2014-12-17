'use strict';

var React = require('react');
var ReactPropTypes = React.PropTypes;
var Firebase = require('firebase');
var ref = new Firebase("https://flashcardsapp.firebaseio.com/");
var controller = require('./controller');




var Grades = module.exports = React.createClass({

  recordSRSAnswer: function(hash, result, grade) {
    var self = this;
    if (this.props.auth) {
      console.log('Recording SRS answer');
      var counterRef = ref.child('users').child(this.props.auth.uid).child('stats').child('srs').child(hash);
      counterRef.once('value', function(snapshot) {
        var val = snapshot.val();
        var attemptedQuestions = val ? val.attemptedQuestions += 1: 1;
        if (result) {
          var correctQuestions = val? val.correctQuestions += 1: 1;
        } else {
          var correctQuestions = val ? val.correctQuestions: 0;
        }
        var o = controller.getRepIntervalAndQuestionDate(attemptedQuestions, grade, val);
        var hesitationInterval = (new Date().getTime()) - self.props.startTime;
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

  checkGrade: function(e) {
    e.preventDefault;
    var grade = +e.target.value;
    if (this.props.isCorrect !== null) {
      this.recordSRSAnswer(this.props.hash, this.props.isCorrect, grade);
      this.props.handleAdvanceFrame(e);
    }
  },

  render: function() {

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

    var isCorrect = this.props.isCorrect;

    if (isCorrect) {
      return (
          <div className="well grades">
            <div>Please select one to advance:</div>
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
          <div className="well grades">
            <div className="grades select-one">Please select one to advance:</div>
            {Object.keys(incorrectGrades).map(function(val, idx) {
              return (
                <div className="grades grades-item" key={idx} >
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

});
