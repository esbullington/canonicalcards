var React = require('react');
var ReactPropTypes = React.PropTypes;
var Firebase = require("firebase");
var CardItem = require('./CardItem');
var firebaseRef = new Firebase("https://flashcardsapp.firebaseio.com/");
var $ = window.jQuery;

var Container  = React.createClass({

  getInitialState: function() {
    return {
      index: 0,
      direction: null,
      cards: []
    }
  },

  componentDidMount: function() {

    firebaseRef.child('cards').on('value', function(snapshot) {
      this.setState({cards: snapshot.val()});
    }.bind(this));

  },

  handleSelect: function(selectedIndex, selectedDirection) {
    console.log('selected=' + selectedIndex + ', direction=' + selectedDirection);
    this.setState({index: selectedIndex, direction: selectedDirection});
  },

  formatAnswers: function(arr) {
    var res = [];
    arr.map(function(el, idx) {
      var o = {
        text: el.back,
        result: this.state.index === idx ? true : false
      };
      res.push(o);
    }, this)
    return res;
  },

  advanceFrame: function(e) {
    console.log('clicked!');
    $('.carousel').carousel('next');
  },

  renderCards: function() {

    var cards = this.state.cards;

    if (this.state.cards.length > 0) {
      return this.state.cards.map(function(el, idx) {
        return (
            <div className={"item " + (this.state.index === idx ? "active" : "")} key={idx} >
              <div className="carousel-wrapped">
                <h3>{el.front}</h3>
                <CardItem answers={this.formatAnswers(cards)} />
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

  getInitialState: function() {
    return {
      pages: [{color: 'black'}, {color: 'orange'}]
    }
  },

  render: function() {
    return (
      <div className="card-container">
        <Container pages={this.state.pages} />
      </div>
    );
  }

});

module.exports = CardContainer;
