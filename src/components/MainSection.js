var React = require('react');
var rb = require('react-bootstrap');
var Carousel = rb.Carousel;
var CarouselItem = rb.CarouselItem;
var ReactPropTypes = React.PropTypes;
var FlashCardActions = require('../actions/FlashCardActions');
var Footer = require('./Footer');

var MainSection = React.createClass({

  render: function() {
    return (
      <div className="container">

        <div className="row">
          <div className="col-lg-12">
            <h1>Full Slider by Start Bootstrap</h1>
            <p>The background images for the slider are set directly in the HTML using inline CSS. The rest of the styles for this template are contained within the <code>full-slider.css</code>file.</p>
          </div>
        </div>

        <hr/>

        <Footer />

      </div>
    );
  }

});

module.exports = MainSection;
