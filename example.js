'use strict';
var arr = require(".");

arr.replace(/regex/g, "String with regex to replace", function(match, callback) {
  setTimeout(function() {
    var replacement_value = match.split('').reverse().join('');
    var err = null;
    callback(err, replacement_value);
  }, 1000);
}, function(err, final_result) {
  if(err) { console.log("Error - " + err); }
  else {
    console.log(final_result);
  }
});
