var React = require('react');


var Formula = module.exports = React.createClass({

  render: function() {
    var formula = this.props.formula;
    var caption = this.props.caption ? <figcaption>{this.props.caption}</figcaption> : <span/>;
    if (formula) {
      return (
        <figure>
          <img src={"data:image/png;base64," + formula} />
          {caption}
        </figure>
        );
    } else {
      return <span></span>;
    }
  }

});
