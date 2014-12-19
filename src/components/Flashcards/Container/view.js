var React = require('react');
var ReactPropTypes = React.PropTypes;
var Router = require('react-router');
var Link = Router.Link;
var Firebase = require("firebase");
var CardComponent = require('../Cards');
var Authentication = require('../../Authentication');
var LayeredComponentMixin = require('mixins/LayeredComponentMixin');
var EndModal = require('./EndModal');
var Signup = require('./Signup');
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

  renderCards: function() {

    var cards = this.state.fullCards;
    var cardsArray = Object.keys(cards);
    var candidates;

    if (cards) {
      return cardsArray.map(function(hash, idx) {
        var originalVal = cards[hash];
        var cardIndex = ""+idx;
        candidates = this.formatCandidates(originalVal, originalVal.candidates);
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
                  question={originalVal}
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
      if (this.state.showModal && (this.props.modalType === 'endmodal')) {
        return (
            <EndModal onRequestClose={this.handleEndModal} />
        );
      } else if (this.state.showModal && (this.props.modalType === 'signup')) {
        return (
            <Signup onRequestClose={this.handleEndModal} />
        );
      } else {
        return <span/>;
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
        <div id="left"></div>
        <div id="right"></div>
        <div id="top"></div>
        <div id="bottom"></div>
        <Container modalType={this.props.modalType} />
        <span id="ribbon"><Link to={this.props.bannerlink}>{this.props.banner}</Link></span>
      </div>
    );
  }

});

module.exports = CardContainer;
