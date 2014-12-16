'use strict';

var React = require('react');
var Formulas = require('../Formulas');
var Grades = require('../Grades');


var Result = React.createClass({

  render: function() {
    var answer = this.props.question.answer;
    var explanation = this.props.question.explanation ? this.props.question.explanation : '';
    var isCorrect = this.props.isCorrect;
    var response =  isCorrect ? "Right" : "Incorrect.  The correct answer is " + answer;
    if (this.props.done && this.props.settings) {
      // First, the render right/wrong paths for those not wanting SRS
      if (this.props.settings.srs) {
        return (
          <div className="result row">
            <div className="result col-md-6">
              <div>{response}
                <div className="result explanation">{explanation}</div>
              </div>
              <Grades
                startTime={this.props.startTime}
                auth={this.props.auth}
                hash={this.props.hash}
                handleAdvanceFrame={this.props.handleAdvanceFrame}
                isCorrect={this.props.isCorrect}
              />
            </div>
            <div className="result col-md-6">
              <Formulas formula={this.props.question.formula} />
            </div>
          </div>
        );
      } else {
        return (
          <div className="result row">
            <div className="result col-md-6">
              <div>{response}
                <div className="result explanation">{explanation}</div>
              </div>
              <button onClick={this.props.handleAdvanceFrame} className="result btn btn-default btn-lg">Next</button>
            </div>
            <div className="col-md-6">
              <Formulas formula={this.props.question.formula} />
            </div>
          </div>
        );
      }
    }
    return <span></span>;
  }

});

module.exports = Result;
