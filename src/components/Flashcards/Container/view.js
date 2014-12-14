var React = require('react');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router');
var Link = Router.Link;
var Firebase = require("firebase");
var CardComponent = require('../Card');
var LayeredComponentMixin = require('mixins/LayeredComponentMixin');
var EndModal = require('./EndModal');
var constants = require('constants/AppConstants');
var localStorageKey = constants.localStorageKey;
var firebaseRef = new Firebase("https://flashcardsapp.firebaseio.com/");
var controller = require('./controller');
var $ = window.jQuery;


var Container  = React.createClass({

  mixins: [LayeredComponentMixin],

  getInitialState: function() {
    return {
      showModal: false,
      cloze: null,
      cardIndex: 0,
      fullCards: {}
    }
  },

  handleEndModal: function() {
    this.setState({showModal: !this.state.showModal});
  },

  componentDidMount: function() {

    if (this.isMounted()) {
      var cards = JSON.parse(localStorage.getItem('cards'));
      if (cards) {
        this.setState({fullCards: cards});
      } else {
        console.log('Loading cards...');
        firebaseRef.child('cards').on('value', function(snapshot) {
          var fullCards = snapshot.val();
          this.setState({fullCards: fullCards});
          localStorage.setItem('cards', JSON.stringify(fullCards));
        }.bind(this));
      }
    } 

  },

  setIndex: function(i) {
    this.setState({cardIndex: i});
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
    return controller.shuffleArray(res);
  },

  formatCandidates: function(hash, fullCards) {
    var sampledCards = controller.randomSample(fullCards, hash, constants.nQuestionCandidates);
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
    return controller.shuffleArray(res);
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
          var nOccurences = controller.occurrences(val.question, '{{', false);
          var queryIndex = controller.getRandomInt(0, nOccurences);
          var cloze = controller.makeCloze(val.question, queryIndex);
          val.question = cloze.question;
          val.answer = cloze.answer;
          candidates = cloze.candidates;
        } else if (val.type === 'candidates') {
          candidates = this.formatProvidedCandidates(val, val.candidates);
        } else {
          candidates = this.formatCandidates(hash, cards)
        }
        return (
            <div className={"item " + (this.state.cardIndex === idx ? "active" : "")} key={idx} >
              <div className="carousel-wrapped">
                <h3>{"Question " + idx + ": " + val.question}</h3>
                <CardComponent
                  handleEndModal={this.handleEndModal}
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

  renderLayer: function() {
      if (!this.state.showModal) {
          return <span />;
      }
      return (
          <EndModal onRequestClose={this.handleEndModal} />
      );
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
