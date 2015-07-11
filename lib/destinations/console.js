"use strict";

var _ = require("lodash");
var Promise = require("bluebird");

var LogLevels = require("../loglevels");

/*
 *	Type: ConsoleDestination
 *		A log destination type for sending log messages to the console via Node.js's
 *		console.log/error functions.
 */

/*
 *	Constructor
 *		Takes a single parameter, which should contain some or all of the following options:
 *			logTimestamp: optional, default false, specifies whether timestamps should be logged, if they are contained in
 *				metadata
 *			logTransactionID: optional, default false, specifies whether transaction ids should be logged, if they are contained in
 *				metadata
 *			logProcessID: optional, default false, specifies whether process ids should be logged, if they are contained in
 *				metadata
 *
 *		None of the options are required.
 */
function ConsoleDestination(options) {
	var defaultOptions = {
		logTimestamp: false,
		logTransactionID: false,
		logProcessID: false
	};

	_.defaults(options, defaultOptions);

	this.options = options;
}

ConsoleDestination.prototype = {
	/*
	 *	Method: log
	 *		You should not call this method directly. Calling this function directly will not result in
	 *		messages being filtered by logLevel as they should be. 
	 *
	 *		This destination sends the message to either stdout or stderr depending on log level (messages
	 *		with level greater than or equal to LogLevels.Error will be sent to stderr) using the Node.js console
	 *		methods.
	 *
	 *		This destination uses specific metadata sent, based on the options passed to the constructor.
	 *		The final output will be in the form of:
	 *
	 *			"Process: metadata.processID - metadata.timestamp - Transaction: metadata.transactionID - message"
	 *
	 *		with each piece of metadata only being included if the options passed to the constructor specify so,
	 *		and if the metadata is supplied to the function.
	 *
	 *	Returns: A promise, which is handled in a Promise.all by the logging type, allowing you to wait for a
	 *		message to be logged before continuing.
	 */
	log: function(logLevel, message, metadata) {
		
		var defaultMetadata = {
			processID: false,
			timestamp: false,
			transactionID: false
		};

		_.defaults(metadata, defaultMetadata);

		var options = this.options;

		return new Promise(function(resolve) {
			var logMessage = "";

			if (options.logProcessID) {
				logMessage += metadata.processID ? "Process: " + metadata.processID + " - " : "";
			}

			if (options.logTimestamp) {
				logMessage += metadata.timestamp ? metadata.timestamp.toISOString() + " - " : "";
			}

			if (options.logTransactionID) {
				logMessage += metadata.transactionID ? "Transaction: " + metadata.transactionID + " - " : "";
			}

			logMessage += message;

			if(logLevel >= LogLevels.Error) {
				console.error(logMessage);
			} else {
				console.log(logMessage);
			}

			resolve();
		});
	}
};

module.exports = ConsoleDestination;