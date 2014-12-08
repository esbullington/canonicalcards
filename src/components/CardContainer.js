var React = require('react');
var rb = require('react-bootstrap');
var Carousel = rb.Carousel;
var CarouselItem = rb.CarouselItem;
var ReactPropTypes = React.PropTypes;
var FlashCardActions = require('../actions/FlashCardActions');


var Container  = React.createClass({

  getInitialState: function() {
    return {
      index: 0,
      direction: null
    }
  },

  handleSelect: function(selectedIndex, selectedDirection) {
    console.log('selected=' + selectedIndex + ', direction=' + selectedDirection);
    this.setState({index: selectedIndex, direction: selectedDirection});
  },


  render: function () {

    var carouselInstance = (
      <Carousel activeIndex={this.state.index} direction={this.state.direction} onSelect={this.handleSelect}>
        {this.props.pages.map(function(el, idx) {
          return (
            <CarouselItem key={idx} >
              <div className="item">
                <div className="carousel-wrapped">
                  <h3>{el.color}</h3>
                  <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </div>
              </div>
            </CarouselItem>
            )
          })
        }
      </Carousel>
    );


    return carouselInstance;

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
