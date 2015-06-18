var async_regex_replace = require("../index");
var should = require("should");

var replacers = {
	simple : function(match, cb) {
		if(match[0]==="match") {
			cb(null, "replace");
		}
		else {
			cb("Unexpected match - " + match[0]);
		}
	},
        reverse : function(match, cb) {
		cb(null, match[0].split('').reverse().join(''));
        }
}

describe("async-regex-replace", function() {

	describe("replace", function() {

		function run_test(test, done) {
			async_regex_replace.replace(test.regex, test.string, test.replacer, function(err, result) {
				if(err) done(err);
				test.expected.should.equal(result);
				done();
			});
		}

		it("no matches", function(done) {
			run_test({
				regex : /nomatch/,
				string : "Test String",
				expected : "Test String",
				replacer : null
			},
			done);
		});

		it("single match, simple replace", function(done) {
			run_test({
				regex : /match/,
				string : "This is the string to match.",
				expected : "This is the string to replace.",
				replacer : replacers.simple
			},
			done);
		});

		it("single match, reverse replace", function(done) {
			run_test({
				regex : /match/,
				string : "This is the string to match.",
				expected : "This is the string to hctam.",
				replacer : replacers.reverse
			},
			done);
		});

		it("single match, case-insensitive, reverse replace", function(done) {
			run_test({
				regex : /match/i,
				string : "This is the string to mATCh.",
				expected : "This is the string to hCTAm.",
				replacer : replacers.reverse
			},
			done);
		});

		it("multiple matches, simple replace, global flag missing", function(done) {
			run_test({
				regex : /match/,
				string : "The first should match but the second will not match.",
				expected : "The first should replace but the second will not match.",
				replacer : replacers.simple
			},
			done);
		});

		it("multiple matches, simple replace", function(done) {
			run_test({
				regex : /match/g,
				string : "The first should match and the second should match.",
				expected : "The first should replace and the second should replace.",
				replacer : replacers.simple
			},
			done);
		});
	});

	describe("Replacer", function() {

		function run_test(test, done) {
			test.replacer(test.string, function(err, result) {
				if(err) return done(err);
				test.expected.should.equal(result);
				done();
			});
		}

		it("reusable replacer", function(done) {
			run_test( {
				replacer: async_regex_replace.Replacer(/match/, replacers.simple),
				string: "This is the string to match.",
				expected: "This is the string to replace."
			},
			done);

		});
	});
});
