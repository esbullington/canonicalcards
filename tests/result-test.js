
var expect = require('chai').expect;

describe('Result', function() {

  var React = require('react/addons');
  var Result = require('components/Flashcards/Cards/Result/view');
  var TestUtils = React.addons.TestUtils;

  // Mock data
  var candidates = [
    { result: true, text: 'test text' }
  ]

  var question = {
    answer: 0,
    candidates: candidates,
    explanation: {
      test: '..'
    },
    question: 'test text',
    type: 'candidate'
  }

  it('renders Result', function() {

    expect(Result).to.be.ok();

  })

  it('should render Result with only span tag if question is not done', function() {


    var result = TestUtils.renderIntoDocument(
      <Result 
        candidates={candidates}
        hash="292a9ab7-d8af-4043-93fe-1667ee487e4a"
        question={question}
        startTime={1419202891276}
        isCorrect={null}
        done={false}
        correctLetter="A"
        correctIndex={0}
      />
    );

    expect(result).to.be.ok();

    var resultClasses = TestUtils.scryRenderedDOMComponentsWithClass(
      result, 'result');
    expect(resultClasses.length).to.equal(0);

  })

  it('should render Result with div tag if question is done', function() {

    // Switch to "true" and render again
    var resultAfterDone = TestUtils.renderIntoDocument(
      <Result 
        candidates={candidates}
        question={question}
        hash="292a9ab7-d8af-4043-93fe-1667ee487e4a"
        startTime={1419202891276}
        isCorrect={true}
        done={true}
        correctLetter="A"
        correctIndex={0}
      />
    );

    expect(resultAfterDone).to.be.ok();

    var resultClassesAfterDone = TestUtils.scryRenderedDOMComponentsWithTag(
      resultAfterDone, 'div');
    expect(resultClassesAfterDone.length).to.be.above(0);

  });

});
