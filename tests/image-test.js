
var expect = require('chai').expect;

describe('Image', function() {
  it('renders image', function() {
    var React = require('react/addons');

    var Image = require('components/Flashcards/Cards/Image');
    expect(Image).to.be.ok();

    var TestUtils = React.addons.TestUtils;

    var image = TestUtils.renderIntoDocument(
      <Image />
    );

    expect(image).to.be.ok();

    // Check to be sure it's rendered inside a figure tag
    var figure = TestUtils.scryRenderedDOMComponentsWithTag(
      image, 'figure');
    expect(figure.length).to.be.greaterThan(0);
  });
});
