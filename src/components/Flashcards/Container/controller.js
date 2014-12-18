
exports.makeCloze = function(str, queryIndex, cb) {
  var originalString = str;
  var re = /\{\{([^{{}}]*)\}\}/,
    output = [],
    i, match, parts, last;

  while (match = re.exec(str)) {
      parts = match[0].split("\uFFFF");
      if (parts.length < 2) {
          last = output.push(match[0]) - 1;
      } else {
          output[last] = parts[0] + output[last] + parts[1];
      }
      str = str.replace(re, "\uFFFF");
  }
  var candidates = [];
  var answer;
  for (i=0; i < output.length; i++) {
    var val = output[i];
    var capture = val.match(/\{\{([^]*)\}\}/);
    if (i === queryIndex) {
      var newStr = originalString.replace(capture[0], '______');
      originalString = newStr;
      answer = capture[1];
    } else {
      var newStr = originalString.replace(capture[0], capture[1]);
      originalString = newStr;
    }
  }
  return {
    question: originalString,
    answer: answer
  }
}

//http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string
exports.occurrences = function(string, subString, allowOverlapping){

    string+=""; subString+="";
    if(subString.length<=0)return string.length+1;

    var n=0, pos=0;
    var step=(allowOverlapping)?(1):(subString.length);

    while(true){
        pos=string.indexOf(subString,pos);
        if(pos>=0){ n++; pos+=step; } else break;
    }
    return(n);
}

exports.getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

exports.randomSample = function(obj, mandatoryQuestionHash, n) {
  var i;
  var keys = Object.keys(obj)
  var newObj = {};
  var count = 0;
  // We only count up to n -1 since we add the mandatory question at the end
  while (count < n - 1) {
    var randomKey = keys[ keys.length * Math.random() << 0];
    if (!(randomKey in newObj) && (randomKey !== mandatoryQuestionHash)) {
      newObj[randomKey] = obj[randomKey];
      count++;
    }
    newObj[mandatoryQuestionHash] = obj[mandatoryQuestionHash];
  }
  return newObj;
};

/**
 * Randomize array element order in-place.
 * Using Fisher-Yates shuffle algorithm.
 */
exports.shuffleArray = function(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

