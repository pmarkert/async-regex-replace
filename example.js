'use strict';
var async_regex_replace = require(".");

async_regex_replace.replace(/regex/g, "String with regex to replace", function(callback, match) {
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
