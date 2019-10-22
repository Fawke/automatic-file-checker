const fs = require('fs');

// finds a matching pattern in a file and returns the matched pattern if found, empty array otherwise
function patternMatcher(file, patterns) {
	let violations = [];
	try {
		// might wanna convert this to a async function later on.
		const data = fs.readFileSync(file, 'utf-8');
		if (patterns.length > 1) {
			patterns.forEach(pattern => {
				data.toString().match(pattern) ? violations.push(data.toString().match(pattern)) : undefined;
			});
		} else {
			violations = [data.toString().match(patterns)];
		}
	} catch (e) {
		console.error(e.message);
		return;
	}
	const flattenArray = [].concat.apply([], violations);
	return [...new Set(flattenArray)];
}

module.exports = patternMatcher;