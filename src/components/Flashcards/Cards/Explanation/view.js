'use strict';

var React = require('react');
var Formulas = require('../Formulas');


var Explanation = React.createClass({

  render: function() {
    var answer = this.props.question.answer;
    var explanation = this.props.question.explanation ? this.props.question.explanation : '';
    var isCorrect = this.props.isCorrect;
    var response =  isCorrect ? 
      <button className="btn btn-default disabled"><i className="explanation glyphicon glyphicon-ok"></i> Right</button> :
        <button className="btn btn-default disabled"><i className="explanation glyphicon glyphicon-close"></i> Incorrect.  The correct answer is  + {answer}</button> ;
    if (this.props.done) {
        return (
          <div className="row explanation panel panel-default">
            <div className="panel-body">
              <div className="explanation col-md-12">
                <div>
                  {response}
                </div>
              </div>
              <div className="explanation col-md-12">
                <div className="row">
                  <div className="explanation col-md-6">
                    <div className="explanation explanation">
                      <blockquote>
                        {explanation}
                      </blockquote>
                    </div>
                  </div>
                  <div className="explanation col-md-6">
                    <Formulas formula={this.props.question.formula} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
    return <span></span>;
  }

});

module.exports = Explanation;
