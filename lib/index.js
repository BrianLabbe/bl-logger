"use strict";

var LogLevels = require("./loglevels");
var Logger = require("./logger");
var ConsoleDestination = require("./destinations/console");
var FileDestination = require("./destinations/file");
var HTTPJSONDestination = require("./destinations/httpjson");

module.exports = {
	LogLevels: LogLevels,
	Logger: Logger,
	ConsoleDestination: ConsoleDestination,
	FileDestination: FileDestination,
	HTTPJSONDestination: HTTPJSONDestination
};