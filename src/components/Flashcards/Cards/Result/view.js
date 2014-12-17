'use strict';

var React = require('react');
var Formulas = require('../Formulas');
var Grades = require('../Grades');


var Result = React.createClass({

  getInitialState: function() {
    return {
      showExplanation: false
    };
  },

  renderExplanation: function() {
    if (this.state.showExplanation) {
      return (
        <div className="result col-md-12">
          <div className="row">
            <div className="result col-md-6">
              <div className="result explanation">
                <blockquote>
                  {explanation}
                </blockquote>
              </div>
            </div>
            <div className="result col-md-6">
              <Formulas formula={this.props.question.formula} />
            </div>
          </div>
        </div>
      );
    }
  },

  renderResponse: function() {
    if (this.props.isCorrect) {
      return (
        <h3 className="result response"><i className="result glyphicon glyphicon-ok"></i> Right</h3>
      );
    } else {
      return (
        <h3 className="result response"><i className="result glyphicon glyphicon-remove"></i> Incorrect.  The correct answer is: {this.props.question.answer}</h3>
      );
    }
  },

  render: function() {
    var answer = this.props.question.answer;
    var explanation = this.props.question.explanation ? this.props.question.explanation : '';
    var isCorrect = this.props.isCorrect;
    if (this.props.done && this.props.settings) {
      // First, the render right/wrong paths for those not wanting SRS
      if (this.props.settings.srs) {
        return (
          <div className="result row panel panel-default">
            <div className="panel-body">
              <div className="result col-md-12">
                <div>
                  {this.renderResponse()}
                </div>
              </div>
              {this.renderExplanation()}
              <div className="result col-md-12">
                <Grades
                  startTime={this.props.startTime}
                  auth={this.props.auth}
                  hash={this.props.hash}
                  handleAdvanceFrame={this.props.handleAdvanceFrame}
                  isCorrect={isCorrect}
                />
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="result row panel panel-default">
            <div className="panel-body">
              <div className="result col-md-12">
                <div>
                  {this.renderResponse()}
                </div>
              </div>
              {this.renderExplanation()}
              <div className="result col-md-12">
                <button onClick={this.props.handleAdvanceFrame} className="result btn btn-default btn-lg">Next</button>
              </div>
            </div>
          </div>
        );
      }
    }
    return <span></span>;
  }

});

module.exports = Result;
