'use strict';

var React = require('react');
var Formulas = require('../Formulas');
var Grades = require('../Grades');


var Result = React.createClass({

  getInitialState: function() {
    return {
      showText: 'Show',
      showExplanation: false
    };
  },

  handleClick: function(e) {
    this.setState({showText: this.state.showExplanation ? 'Show' : 'Hide', showExplanation: !this.state.showExplanation});
  },

  renderExplanation: function() {
    if (this.state.showExplanation) {
      return (
        <div className="col-md-12 result explanation-row">
          <div className="col-md-6 explanation">
            <div className="explanation explanation-quote">
              <blockquote>
                {this.props.question.explanation}
              </blockquote>
            </div>
          </div>
          <div className="col-md-6 formula explanation text-center">
            {this.props.question.formulas ? 
              this.props.question.formulas.map(function(el, idx) {
                return (
                  <Formulas 
                    key={idx}
                    formula={el.formula} 
                    caption={el.caption} 
                  />
                  )
                }) :
                <span/>
            }
          </div>
        </div>
      );
    }
  },

  renderResponse: function() {
    // I may eventually simplify this section to one return with a couple of ternary expressions
    // if the two alternatives continue to have minimal branching
    if (this.props.isCorrect) {
      return (
        <div>
          <h3 className="result response">
            <span className="result response-text">
              <i className="result glyphicon glyphicon-ok"></i> Right. The correct answer is {this.props.correctLetter}: <em>{this.props.question.answer}</em>
            </span>
            <a onClick={this.handleClick} className="result explanation-btn btn btn-default"><i className="fa fa-lightbulb-o"></i> {this.state.showText} explanation</a>
          </h3>
        </div>
      );
    } else {
      return (
        <div>
          <h3 className="result response">
            <span className="result response-text">
                <i className="result glyphicon glyphicon-remove"></i> Incorrect.  The correct answer is {this.props.correctLetter}: <em>{this.props.question.answer}</em>
            </span>
            <a onClick={this.handleClick} className="result explanation-btn btn btn-default"><i className="fa fa-lightbulb-o"></i> {this.state.showText} explanation</a>
          </h3>
        </div>
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
                <a onClick={this.props.handleAdvanceFrame} className="result btn btn-default btn-lg">Next <i className="fa fa-angle-right"></i></a>
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
