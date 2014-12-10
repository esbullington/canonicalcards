
var getEasinessFactor = function(iterations, grade, oldEasinessFactor) {
  console.log('sp iterations: ', iterations);
  console.log('sp grade: ', grade);

  var easinessFactor;

  if (iterations > 1) {
    easinessFactor = oldEasinessFactor + (0.1 - (5 - grade) * (0.08) + (5 - grade) * 0.02);
  } else {
    easinessFactor = 2.5;
  }

  if (easinessFactor < 1.3) {
    easinessFactor = 1.3;
  }

  console.log('easiness factor: ', easinessFactor);
  return easinessFactor;

}


exports.getNextRepetitionInterval = function(iterations, grade, lastRepetitionInterval, easinessFactor) {
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
