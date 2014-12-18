var React = require('react');


var Image = module.exports = React.createClass({

  renderImage: function(type, data) {
    if (type === 'svg') {
      return <div id="svgImage" dangerouslySetInnerHTML={{__html: data}} ></div>;
    } else {
      return <img id="imgImage" src={"data:image/png;base64," + data} />;
    }
  },

  render: function() {
    var image = this.props.image;
    var type = image.type;
    var data = image.data;
    var caption = this.props.image.caption ? <figcaption>{this.props.image.caption}</figcaption> : <span/>;
    if (image) {
      return (
        <figure>
          {this.renderImage(type, data)}
          {caption}
        </figure>
        );
    } else {
      return <span></span>;
    }
  }

});
