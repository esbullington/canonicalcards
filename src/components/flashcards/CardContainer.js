var React = require('react');
var ReactPropTypes = React.PropTypes;
var Firebase = require("firebase");
var CardItem = require('./CardItem');
var firebaseRef = new Firebase("https://flashcardsapp.firebaseio.com/");

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

  render: function () {

    var self = this;

    var cards = this.state.cards;

    var renderCards = function() {
      if (self.state.cards.length > 0) {
        return self.state.cards.map(function(el, idx) {
          return (
              <div className={"item " + (self.state.index === idx ? "active" : "")} key={idx} >
                <div className="carousel-wrapped">
                  <h3>{el.front}</h3>
                  <CardItem answers={self.formatAnswers(cards)} />
                </div>
              </div>
            )
          });
      } else {
        return <span></span>;
      }
    };

    return  (
      <div id="carousel-example-generic" className="carousel slide" data-ride="carousel" data-interval={false} data-wrap={false} >
        <div className="carousel-inner" role="listbox"  >
        {renderCards()}
        </div>
        <a className="left carousel-control" href="#carousel-example-generic" role="button" data-slide="prev">
          <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
          <span className="sr-only">Previous</span>
        </a>
        <a className="right carousel-control" href="#carousel-example-generic" role="button" data-slide="next">
          <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
          <span className="sr-only">Next</span>
        </a>
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
