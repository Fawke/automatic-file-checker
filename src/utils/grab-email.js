const patternMatcher = require('./pattern-matcher');

// Takes in a file, searches for a email in that file, if found, returns that email.
function grabEmail(file) {
	const email = patternMatcher(file, /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
	return email;
}

module.exports = grabEmail;