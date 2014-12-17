
var getEasinessFactor = function(iterations, grade, oldEasinessFactor) {
  var easinessFactor;
  if (iterations > 1) {
    easinessFactor = oldEasinessFactor + (0.1 - (5 - grade) * (0.08) + (5 - grade) * 0.02);
  } else {
    easinessFactor = 2.5;
  }
  if (easinessFactor < 1.3) {
    easinessFactor = 1.3;
  }
  return easinessFactor;
}

var getNextRepetitionInterval = function(iterations, grade, lastRepetitionInterval, easinessFactor) {
  var nextRepetitionInterval;
  if (iterations === 1) {
    nextRepetitionInterval = 1;
  } else if (iterations === 2) {
    nextRepetitionInterval = 6;
  } else {
    nextRepetitionInterval = lastRepetitionInterval * getEasinessFactor(iterations, grade, easinessFactor);
  }
  return nextRepetitionInterval;
}

exports.getRepIntervalAndQuestionDate = function(attemptedQuestions, grade, val) {
  var repIntervalAndQuestionDate;
  var lastRepetitionInterval = val ? val.lastRepetitionInterval: 1;
  var easinessFactor = val && val.easinessFactor ? val.easinessFactor: 2.5;
  var i = getNextRepetitionInterval(attemptedQuestions, grade, lastRepetitionInterval, easinessFactor);
  var today = new Date();
  var nextQuestionDate = today.getTime() + (24*60*60*1000*i); 
  repIntervalAndQuestionDate = {
    lastRepetitionInterval: i,
    nextQuestionDate: nextQuestionDate
  };
  return repIntervalAndQuestionDate;
}

