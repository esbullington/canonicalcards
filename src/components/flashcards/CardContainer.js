var React = require('react');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router');
var Link = Router.Link;
var Firebase = require("firebase");
var CardItem = require('./CardItem');
var firebaseRef = new Firebase("https://flashcardsapp.firebaseio.com/");
var $ = window.jQuery;
var _ = require('lodash');

function randomSample(obj, mandatoryQuestionHash, n) {
  var i;
  var keys = Object.keys(obj)
  var newObj = {};
  var count = 0;
  // We only count up to n -1 since we add the mandatory question at the end
  while (count < n - 1) {
    var randomKey = keys[ keys.length * Math.random() << 0];
    console.log('randomKey', randomKey);
    if (!(randomKey in newObj) && (randomKey !== mandatoryQuestionHash)) {
      newObj[randomKey] = obj[randomKey];
      count++;
    }
    newObj[mandatoryQuestionHash] = obj[mandatoryQuestionHash];
  }
  return newObj;
};

/**
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

var Container  = React.createClass({

  getInitialState: function() {
    return {
      index: 0,
      direction: null,
      fullCards: {},
      sampledCards: {}
    }
  },

  componentDidMount: function() {

    if (this.isMounted()) {
      firebaseRef.child('cards').on('value', function(snapshot) {
        var fullCards = snapshot.val();
        this.setState({fullCards: fullCards});
      }.bind(this));
    }

  },

  setIndex: function(i) {
    this.setState({index: i});
  },

  formatCandidates: function(hash, cards) {
    var cards = randomSample(cards, hash, 2);
    var question = cards[hash].question;
    var res = [];
    Object.keys(cards).map(function(val, idx) {
      var o = {
        hash: val,
        text: cards[val].answer,
        result: cards[val].question === question ? true : false
      };
      res.push(o);
    }, this)
    return shuffleArray(res);
  },

  renderCards: function() {

    var cards = this.state.fullCards;

    if (cards) {
      return Object.keys(cards).map(function(hash, idx) {
        return (
            <div className={"item " + (this.state.index === idx ? "active" : "")} key={idx} >
              <div className="carousel-wrapped">
                <h3>{cards[hash].question}</h3>
                <CardItem setIndex={this.setIndex} candidates={this.formatCandidates(hash, cards)} hash={hash} question={cards[hash]} />
              </div>
            </div>
          )
        }, this);
    } else {
      return <span></span>;
    }

  },

  render: function () {

    return  (
      <div id="carousel-example-generic" className="carousel slide" data-ride="carousel" data-interval={false} data-wrap={false} >
        <div className="carousel-inner" role="listbox"  >
        {this.renderCards()}
        </div>
      </div>
    );

  }

});


var CardContainer = React.createClass({

  render: function() {
    return (
      <div className="card-container">
        <Container />
        <span id="ribbon"><Link to="dashboard">Dashboard</Link></span>
      </div>
    );
  }

});

module.exports = CardContainer;
