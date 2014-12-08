var React = require('react');
var rb = require('react-bootstrap');
var Carousel = rb.Carousel;
var CarouselItem = rb.CarouselItem;
var ReactPropTypes = React.PropTypes;
var FlashCardActions = require('../actions/FlashCardActions');
var FlashCardItem = require('./FlashCardItem');


var Container  = React.createClass({


  render: function () {

    var index = 0;
    var direction = null;

    function renderCarousel () {
      return (
        <Carousel activeIndex={index} direction={direction} onSelect={handleSelect}>
          <CarouselItem>
            <img width={900} height={500} alt="900x500" src="http://placehold.it/900x500" />
            <div className="carousel-caption">
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </div>
          </CarouselItem>
          <CarouselItem>
            <img width={900} height={500} alt="900x500" src="http://placehold.it/900x500" />
            <div className="carousel-caption">
              <h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          </CarouselItem>
          <CarouselItem>
            <img width={900} height={500} alt="900x500" src="http://placehold.it/900x500" />
            <div className="carousel-caption">
              <h3>Third slide label</h3>
              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
            </div>
          </CarouselItem>
        </Carousel>
      );

    }


    var handleSelect = function(selectedIndex, selectedDirection) {
      console.log('selected=' + selectedIndex + ', direction=' + selectedDirection);
      index = selectedIndex;
      direction = selectedDirection;
      renderCarousel();
    }

    return (
          <div >
            {renderCarousel()}
          </div>
        );

  }

});


var MainSection = React.createClass({

  getInitialState: function() {
    return {
      pages: [{color: 'black'}, {color: 'orange'}]
    }
  },

  render: function() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div>
            <Container />
            </div>
            <i className="fa fa-angle-double-left fa-4x" ></i>
            <i className="fa fa-angle-double-right fa-4x" ></i>
          </div>
        </div>
      </div>
    );
  }

});

module.exports = MainSection;
