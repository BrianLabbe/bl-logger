"use strict";

var _ = require("lodash");
var Promise = require("bluebird");

var LogLevels = require("./loglevels");

/*
 *	Type: Logger
 *		This is the main logger. Attach instances of destinations using the attachDestination method to
 *		direct log messages where you want them. (For example, an HTTPJSONDestination type is provided
 *		which sends log messages and metadata to a URL you supply). Use setLogLevel to set the level
 *		below which messages will not be logged. To set default metadata (for example, a uuid process
 *		id might be useful default metadata for every log message if you have multiple apps or instances
 *		of apps sending logs to the same URL) access the defaultMetadata property.
 */

/*
 *	Constructor
 *		Takes no parameters. Log level defaults ot LogLevels.Info
 */
function Logger() {
	this.destinations = [];
	this.logLevel = LogLevels.Info;
	this.defaultMetadata = {};
}

Logger.prototype = {
	/*
	 *	Method: log
	 *		Use this method to log messages. If the provided loglevel is high enough, then logger will pass
	 *		the message and the metadata to all attached destinations.
	 *
	 *	Parameter: logLevel
	 *		Should be a number. If this logLevel is greather than or equal to the logger's logLevel, then
	 *		the message and metadata will be logged to any attached destinations. It is recommended that
	 *		you use the LogLevels provided by bl-logger
	 *
	 *	Parameter: message
	 *		The message to be logged. Destinations provided by bl-logger will always include this in their
	 *		output
	 *
	 *	Paremeter: metadata
	 *		What is done with the metadata depends on the destination. See the bl-logger provided destinations
	 *		for info about how they use any provided metadata.
	 */
	log: function(logLevel, message, metadata) {
		if (typeof logLevel != "number") {
			return Promise.reject(Error("Log Level should be a number"));
		}

		if (typeof message === "undefined") {
			return Promise.reject(Error("Message is not defined"));
		}

		var loggingPromises = [];

		metadata = metadata ? metadata : {};
		_.defaults(metadata, this.defaultMetadata);

		this.destinations.forEach(function(destination) {
			if (!destination.log || typeof destination.log !== "function") {
				return;
			}

			if (logLevel >= this.logLevel) {
				loggingPromises.push(destination.log(logLevel, message, metadata));
			}
		}, this);

		return Promise.all(loggingPromises);
	},

	/*
	 *	Method: attachDestination
	 *		Prefer using this method over directly accessing the destinations property. If a destination
	 *		passed to this method is not an object with a log method, then an exception will be thrown.
	 *		Adding such a destination via direct access to the property will result in log attempts to
	 *		that destination silently failing.
	 *
	 *	Parameter: destination
	 *		The destination supplied should be an object with a log method taking 3 arguments (logLevel,
	 *		message, metadata). For examples of how destinations should work, see the bl-logger provided
	 *		destinations.
	 */
	attachDestination: function(destination) {
		if (!destination.log || typeof destination.log !== "function") {
			throw new Error("Added destination has no log() method");
		}

		this.destinations.push(destination);
	},

	/*
	 *	Method: setLogLevel
	 *		Prefer using this method over directly accessing the destinations property. If a destination
	 *		passed to this method is not an object with a log method, then an exception will be thrown.
	 *		Adding such a destination via direct access to the property will result in log attempts to
	 *		that destination silently failing.
	 *
	 *	Parameter: logLevel
	 *		This should be a number. It is recommended that you use the LogLevels provided by bl-logger.
	 *		Any messages logged with a level below this level will not be passed to the destinations
	 */
	setLogLevel: function(logLevel) {
		if (typeof logLevel != "number") {
			throw new Error("Log level should be a number");
		}
	}
};

module.exports = Logger;