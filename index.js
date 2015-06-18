var dns = require("dns");

module.exports = {
	replace : replace,
	Replacer : Replacer
};

/**
 * Replaces instances of the regex in str using the asynchronous callback function, replacer
 *
 * @param {regex} regex The regex object to execute.
 * @param {string} str The string to be matched
 * @param {function} replacer The asynchronous callback function called to translate matches into replacements
 * @param {function} done The callback function invoked on completion or error
 *
 * The replacer callback should take two parameters (match, callback). match is the result from regex.exec(), including capturing groups.
 *  callback should be invoked with (err, replacement_value) when done.
 *
 * The done callback will be invoked with (err, result) once all replacements have been processed.
 *
 */
function replace(regex, str, replacer, done) {
	var match = regex.exec(str);
	if(match==null) { // No matches, we are done.
		done(null, str);
	}
	else {
		// Found a match, call the async replacer
		replacer(match, function(err, result) {
			if(err) { // If the replacer failed, callback and pass the error
				return done(err, result);
			}
			var matchIndex = match.index;
			var matchLength = match[0].length;
			// Splice the replacement back into the string
			var new_str = str.substring(0,matchIndex) + result + str.substring(matchIndex + matchLength);
			if(regex.global) { // Keep replacing
				replace(regex, new_str, replacer, done);
			}
			else {
				done(null, new_str);
			}
		});
	}
}

/**
 * Constructor function that returns a closuer locking in the regex and the replacer.
 *
 * @param {regex} regex The regex object to execute
 * @param {function} replacer The asynchronous callback function called to translate matches into replacements
 *
 * @returns {function} a function that can be called with (str, done) to execute the replacements.
 */
function Replacer(regex, replacer) {
	var flags = (regex.global ? "g" : "") + (regex.ignoreCase ? "i" : "") + (regex.multiline ? "m" : "");
	return function(str, done) {
		// Cloning the regex so it has it's own lastIndex state to avoid concurrency issues
		var re_clone = new RegExp(regex.source, flags);
		replace(re_clone, str, replacer, done);
	}
}
