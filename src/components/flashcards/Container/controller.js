
var makeCloze = exports.makeCloze = function(str, queryIndex, cb) {
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
  for (i=0; i < output.length; i++) {
    var val = output[i];
    var capture = val.match(/\{\{([^]*)\}\}/);
    resultObject = {text: capture[1]};
    if (i === queryIndex) {
      var newStr = originalString.replace(capture[0], '______');
      originalString = newStr;
      resultObject['result'] = true;
    } else {
      var newStr = originalString.replace(capture[0], capture[1]);
      originalString = newStr;
      resultObject['result'] = false;
    }
    candidates.push(resultObject);
  }
  return {
    question: originalString,
    candidates: candidates,
    answer: candidates[queryIndex]
  }
}

if (module === require.main) {
  var ret = makeCloze("abc {{d(e())f}} testing {{gh}} {{test}}", 0);
  console.log(ret);
}
