"use strict";

var _ = require("lodash");
var Promise = require("bluebird");
var request = Promise.promisify(require("request"));

/*
 *	Type: HTTPJSONDestination
 *		A log destination type for sending log levels and messages to an HTTP URL, with the
 *		specified method and also optionally sending headers provided at construction. Do not
 *		use an instance of this type on its own. Instead, you should attach an instance of this
 *		type to an instance of Logger.
 */

/*
 *	Constructor
 *		Takes a single parameter, which should contain some or all of the following options:
 *			url: required, defines the url to send messages to
 *			method: required, defines the HTTP method to use when sending messages
 *			headers: optional, default {}, should be an object in the form of:
 *				{
 *					"Header1Name":"Header1Value",
 *					"Header2Name":"Header2Value",
 *					...
 *				}
 *
 *		If any of the required options are not supplied, an exception will be thrown.
 */
function HTTPJSONDestination(options) {
	var defaultOptions = {
		url: false,
		method: false,
		headers: {}
	};

	_.defaults(options, defaultOptions);

	if (!options.url) {
		throw new Error("url is a required option");
	}

	if (!options.method) {
		throw new Error("method is a required option");
	}

	this.options = options;
}

HTTPJSONDestination.prototype = {
	/*
	 *	Method: log
	 *		You should not call this method directly. Calling this function directly will not result in
	 *		messages being filtered by logLevel as they should be.
	 *
	 *		This destination sends the message in the form of a JSON object in the form of:
	 *			var data = {
	 *				logLevel: logLevel,
	 *				message: message,
	 *				metadata: metadata
	 *			};
	 *		as such, this type itself doesn't do anything with the metadata other than send it
	 *		along with the message. It sends all metadata provided, so you can pass any metadata
	 *		you need to the recipient.
	 *
	 *	Returns: A promise, which is handled in a Promise.all by the logging type, allowing you to wait for a
	 *		message to be logged before continuing.
	 */
	log: function(logLevel, message, metadata) {
		var options = this.options;

		var data = {
			logLevel: logLevel,
			message: message,
			metadata: metadata
		};

		var requestOptions = {
			url: options.url,
			method: options.method,
			headers: options.headers,
			json: true,
			body: data
		};

		return request(requestOptions);
	}
};

module.exports = HTTPJSONDestination;