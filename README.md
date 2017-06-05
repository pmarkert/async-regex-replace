# async-regex-replace
node.js library for regex replacements using asynchronous callback functions

"All I needed" was a simple function to do string.replace(/regex/, callback_function) so that I could find some matches in a
string and then call my own custom function to return the value to be replaced back into the string. Sounds pretty easy right? 
It is, as long as your callback function is syncrhonous. :)

What happens if you need to call an asychronous function to determine the replacement value(s)? 
Perhaps you are using the matched value to lookup the replacement in a database. 

## Enter async-regex-replace

<!--@example('./example.js')-->
``` js
'use strict';
var async_regex_replace = require('async-regex-replace');

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
    //> String with xeger to replace
  }
});
```
<!--/@-->

NOTE: In this particular example, the gratuitous use of setTimeout is just to demonstrate the asynchronous functionality in the replacement callback.

### Captured groups
If your regex contains capture groups, they will be passed in as extra parameters after the match but before the callback.
