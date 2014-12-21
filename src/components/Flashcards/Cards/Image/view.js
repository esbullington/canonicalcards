var React = require('react');


var Image = module.exports = React.createClass({

  propTypes: {
    imageProp: React.PropTypes.object
  },

  getDefaultProps: function() {
    return {
      imageProp: {}
    }
  },

  renderImage: function(imageType, data) {
    if (imageType === 'svg') {
      return <div id="svgImage" dangerouslySetInnerHTML={{__html: data}} ></div>;
    } else {
      return <img id="imgImage" src={"data:image/png;base64," + data} />;
    }
  },

  render: function() {
    var imageProp = this.props.imageProp;
    if (imageProp) {
      var imageType = imageProp.type;
      var data = imageProp.data;
      var caption = imageProp.caption ? <figcaption>{imageProp.caption}</figcaption> : <span/>;
      return (
        <figure>
          {this.renderImage(imageType, data)}
          {caption}
        </figure>
        );
    } else {
      return <span></span>;
    }
  }

});
