var React = require('react');
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

    var self = this;

    var carouselInstance = (
      <div id="carousel-example-generic" className="carousel slide" data-ride="carousel" data-interval={false} data-wrap={false} >
        <div className="carousel-inner" role="listbox"  >
        {this.props.pages.map(function(el, idx) {
          return (
              <div className={"item " + (self.state.index === idx ? "active" : "")} key={idx} >
                <div className="carousel-wrapped">
                  <h3>{el.color}</h3>
                  <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </div>
              </div>
            )
          })
        }
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
