var React = require('react');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router');
var Link = Router.Link;
var Firebase = require("firebase");
var CardItem = require('../Card');
var constants = require('constants/AppConstants');
var localStorageKey = constants.localStorageKey;
var firebaseRef = new Firebase("https://flashcardsapp.firebaseio.com/");
var makeCloze = require('./controller').makeCloze;
var $ = window.jQuery;


//http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string
function occurrences(string, subString, allowOverlapping){

    string+=""; subString+="";
    if(subString.length<=0) return string.length+1;

    var n=0, pos=0;
    var step=(allowOverlapping)?(1):(subString.length);

    while(true){
        pos=string.indexOf(subString,pos);
        if(pos>=0){ n++; pos+=step; } else break;
    }
    return(n);
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

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
      cloze: null,
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
    var candidates;

    if (cards) {
      return cardsArray.map(function(hash, idx) {
        var cardIndex = ""+idx;
        var val = $.extend(true, {}, cards[hash]);
        if (val.type === 'template') {
          var nOccurences = occurrences(val.question, '{{', false);
          var queryIndex = getRandomInt(0, nOccurences);
          var cloze = makeCloze(val.question, queryIndex);
          val.question = cloze.question;
          val.answer = cloze.answer;
          candidates = cloze.candidates;
        } else if (val.type === 'candidates') {
          candidates = this.formatProvidedCandidates(val, val.candidates);
        } else {
          candidates = this.formatCandidates(hash, cards)
        }
        return (
            <div className={"item " + (this.state.index === idx ? "active" : "")} key={idx} >
              <div className="carousel-wrapped">
                <h3>{"Question " + idx + ": " + val.question}</h3>
                <CardItem
                  cardIndex={cardIndex}
                  setIndex={this.setIndex}
                  cardsLength={cardsArray.length}
                  candidates={candidates}
                  hash={hash} question={val}
                />
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
