var React = require('react');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router');
var Link = Router.Link;
var Firebase = require("firebase");
var CardItem = require('./CardItem');
var constants = require('../../constants/AppConstants');
var localStorageKey = constants.localStorageKey;
var firebaseRef = new Firebase("https://flashcardsapp.firebaseio.com/");
var $ = window.jQuery;

function randomSample(obj, mandatoryQuestionHash, n) {
  var i;
  var keys = Object.keys(obj)
  var newObj = {};
  var count = 0;
  // We only count up to n -1 since we add the mandatory question at the end
  while (count < n - 1) {
    var randomKey = keys[ keys.length * Math.random() << 0];
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
      var cards = JSON.parse(localStorage.getItem('cards'));
      if (cards) {
        this.setState({fullCards: cards});
      } else {
        console.log('loading cards...');
        firebaseRef.child('cards').on('value', function(snapshot) {
          var fullCards = snapshot.val();
          this.setState({fullCards: fullCards});
          localStorage.setItem('cards', JSON.stringify(fullCards));
        }.bind(this));
      }
    } 

  },

  setIndex: function(i) {
    this.setState({index: i});
  },

  formatProvidedCandidates: function(card, providedCandidates) {
    var res = [];
    providedCandidates.map(function(val, idx) {
      var o = {
        text: val,
        result: card.answer === val ? true : false
      };
      res.push(o);
    }, this);
    return shuffleArray(res);
  },

  formatCandidates: function(hash, fullCards) {
    var sampledCards = randomSample(fullCards, hash, constants.nQuestionCandidates);
    var question = sampledCards[hash].question;
    var res = [];
    Object.keys(sampledCards).map(function(val, idx) {
      var o = {
        hash: val,
        text: sampledCards[val].answer,
        result: sampledCards[val].question === question ? true : false
      };
      res.push(o);
    }, this)
    return shuffleArray(res);
  },

  renderCards: function() {

    var cards = this.state.fullCards;

    var cardsArray = Object.keys(cards);

    if (cards) {
      return cardsArray.map(function(hash, idx) {
        var cardIndex = ""+idx;
        return (
            <div className={"item " + (this.state.index === idx ? "active" : "")} key={idx} >
              <div className="carousel-wrapped">
                <h3>{"Question " + idx + ": " + cards[hash].question}</h3>
                <CardItem cardIndex={cardIndex} setIndex={this.setIndex} cardsLength={cardsArray.length} candidates={cards[hash].candidates ? this.formatProvidedCandidates(cards[hash], cards[hash].candidates) : this.formatCandidates(hash, cards)} hash={hash} question={cards[hash]} />
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
