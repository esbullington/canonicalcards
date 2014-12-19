var React = require('react');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router');
var Link = Router.Link;
var Firebase = require("firebase");
var CardComponent = require('../Cards');
var Authentication = require('../../Authentication');
var LayeredComponentMixin = require('mixins/LayeredComponentMixin');
var EndModal = require('./EndModal');
var constants = require('constants/AppConstants');
var localStorageKey = constants.localStorageKey;
var firebaseRef = new Firebase("https://flashcardsapp.firebaseio.com/");
var controller = require('./controller');
var PubSub = require('pubsub-js');
var EventTypes = require('constants/EventTypes');
var DEAL_CARDS = EventTypes.DEAL_CARDS;
var $ = window.jQuery;


var Container  = React.createClass({

  mixins: [ LayeredComponentMixin, Authentication ],

  getInitialState: function() {
    return {
      showModal: false,
      cloze: null,
      cardIndex: 0,
      fullCards: {},
      done: false,
      locked: false
    }
  },

  handleEndModal: function() {
    this.setState({showModal: !this.state.showModal});
  },

  componentDidMount: function() {

    if (this.isMounted()) {
      // var cards = JSON.parse(localStorage.getItem('cards'));
      // if (cards) {
      //   this.setState({fullCards: cards});
      // } else {
        console.log('Loading cards...');
        firebaseRef.child('cards').on('value', function(snapshot) {
          var fullCards = snapshot.val();
          this.setState({fullCards: fullCards});
          localStorage.setItem('cards', JSON.stringify(fullCards));
        }.bind(this));
      // }
    } 
    PubSub.subscribe(DEAL_CARDS, function(msg, data) {
      console.log('Dealing cards');
      this.setState({done: false, locked: false, showModal: false});
      $('.carousel').carousel('next');
    }.bind(this));

  },

  setIndex: function(i) {
    this.setState({cardIndex: i});
  },

  formatCandidates: function(card, providedCandidates) {
    var res = [];
    providedCandidates.map(function(val, idx) {
      var o = {
        text: val,
        result: +card.answer === idx ? true : false
      };
      res.push(o);
    }, this);
    return controller.shuffleArray(res);
  },

  formatStandard: function(hash, fullCards) {
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

  getCloze: function(val) {
    var nOccurences = controller.occurrences(val.question, '{{', false);
    var queryIndex = controller.getRandomInt(0, nOccurences);
    var cloze = controller.makeCloze(val.question, queryIndex);
    var candidates = val.candidates[queryIndex];
    var res = [];
    candidates.map(function(el, idx) {
      var o = {
        text: el,
        result: el == cloze.answer ? true : false
      };
      res.push(o);
    }, this)
    cloze.candidates = controller.shuffleArray(res);
    return cloze;
  },

  renderCards: function() {

    var cards = this.state.fullCards;
    var cardsArray = Object.keys(cards);
    var candidates;

    if (cards) {
      return cardsArray.map(function(hash, idx) {
        var originalVal = cards[hash];
        var cardIndex = ""+idx;
        var mutatedVal = $.extend(true, {}, cards[hash]);
        if (mutatedVal.type === 'template') {
          var a = true;
          var cloze = this.getCloze(mutatedVal);
          mutatedVal.question = cloze.question;
          candidates = cloze.candidates;
        } else if (originalVal.type === 'candidate') {
          candidates = this.formatCandidates(originalVal, originalVal.candidates);
        } else {
          console.log('Error formatting cards');
        }
        return (
            <div className={"item " + (this.state.cardIndex === idx ? "active" : "")} key={idx} >
              <div className="carousel-wrapped">
                <CardComponent
                  handleEndModal={this.handleEndModal}
                  cardIndex={cardIndex}
                  setIndex={this.setIndex}
                  cardsLength={cardsArray.length}
                  candidates={candidates}
                  hash={hash}
                  question={originalVal.type === 'template' ? mutatedVal : originalVal}
                  done={this.state.done}
                  locked={this.state.locked}
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
        <div id="left"></div>
        <div id="right"></div>
        <div id="top"></div>
        <div id="bottom"></div>
        <Container />
        <span id="ribbon"><Link to="dashboard">Dashboard</Link></span>
      </div>
    );
  }

});

module.exports = CardContainer;
