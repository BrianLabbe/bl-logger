"use strict";

var _ = require("lodash");
var Promise = require("bluebird");
var fs = require("fs");

/*
 *	Type: ConsoleDestination
 *		A log destination type for sending log messages to a file
 */

/*
 *	Constructor
 *		Takes a single parameter, which should contain some or all of the following options:
 *			filename: required, specifies the path to the file messages should be logged to
 *			append: optional, default true, specifies whether the file should be opened in append mode (if false,
 *				the file will be overwritten);
 *			logTimestamp: optional, default false, specifies whether timestamps should be logged, if they are contained in
 *				metadata
 *			logTransactionID: optional, default false, specifies whether transaction ids should be logged, if they are contained in
 *				metadata
 *			logProcessID: optional, default false, specifies whether process ids should be logged, if they are contained in
 *				metadata
 *
 *		If any of the required options are not supplied, an exception will be thrown.
 */
function FileDestination(options) {
	var defaultOptions = {
		append: true,
		filename: false,
		logTimestamp: false,
		logTransactionID: false,
		logProcessID: false
	};

	_.defaults(options, defaultOptions);

	if (!options.filename) {
		throw new Error("filename is a required option");
	}

	this.options = options;

	var filemode = options.append ? "a" : "w";

	this.file = fs.openSync(options.filename, filemode);
}

FileDestination.prototype = {
	/*
	 *	Method: log
	 *		You should not call this method directly. Calling this function directly will not result in
	 *		messages being filtered by logLevel as they should be. 
	 *
	 *		This destination sends the message to a file specified by the options passed to the constructor
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
		var file = this.file;

		return new Promise(function(resolve, reject) {
			var logMessage = "";

			if (options.logProcessID) {
				logMessage += metadata.processID ? "Process: " + metadata.processID + " - " : "";
			}

			if (options.logTimestamp) {
				logMessage += metadata.timestamp ? metadata.timestamp.toISOString() + " - " : "";
			}

			if (options.logTransactionID) {
				logMessage += metadata.transactionID ? "Transaction ID: " + metadata.transactionID + " - " : "";
			}

			logMessage += message;

			fs.writeSync(file, logMessage + "\n");
			fs.fsyncSync(file);

			resolve();
		});
	}
};

module.exports = FileDestination;