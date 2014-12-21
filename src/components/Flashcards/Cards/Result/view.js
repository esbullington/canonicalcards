'use strict';

var React = require('react');
var Image = require('../Image');


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

  renderLinks: function() {
    if (this.props.question.explanation.links) {
      return (
          <div className="explanation links">Links:
            <ul id="explanationLinksList">
              {this.props.question.explanation.links.map(function(el, idx) {
                return <li key={idx}><a href={el.link}>{el.text}</a></li>
               })
              }
            </ul>
          </div>
        );
    }
  },

  renderExplanation: function() {
    var props = this.props;
    var explanation = props.question.explanation.text;
    if (this.state.showExplanation) {
      return (
        <div className="col-md-12 result explanation-row">
          <div className="col-md-8 explanation">
            <div className="explanation explanation-quote">
              <blockquote>
                <span id="explanationQuote">{explanation} </span>
              </blockquote>
            </div>
          </div>
          <div className="col-md-4 image explanation">
            {this.props.question.images ? 
              this.props.question.images.map(function(image, idx) {
                return (
                  <div key={idx} className="text-center">
                    <Image 
                      key={idx}
                      image={image} 
                    />
                    <div>{this.renderLinks()}</div>
                  </div>
                  )
                }) : <div>{this.renderLinks()}</div>
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
              <i className="result glyphicon glyphicon-ok"></i> Right. The correct answer is {this.props.correctLetter}: <em>{this.props.candidates[this.props.correctIndex]}</em>
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
                <i className="result glyphicon glyphicon-remove"></i> Incorrect.  The correct answer is {this.props.correctLetter}: <em>{this.props.candidates[this.props.correctIndex]}</em>
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
    if (this.props.done) {
      // First, the render right/wrong paths for those not wanting SRS
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
    return <span></span>;
  }

});

module.exports = Result;
