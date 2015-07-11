"use strict";

/*
 *	Type: LogLevels
 *		This is an convenience object for having named log levels
 */

var LogLevels = Object.freeze({
	Debug: 0,
	Info: 1,
	Warning: 2,
	Error: 3,
	Fatal: 4,
	None: 5
});

module.exports = LogLevels;