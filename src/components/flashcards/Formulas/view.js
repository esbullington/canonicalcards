var React = require('react');


var Formula = module.exports = React.createClass({

  render: function() {
    var formula = this.props.formula;
    if (formula) {
      return <img src={"data:image/png;base64," + formula} />;
    } else {
      return <span></span>;
    }
  }

});
