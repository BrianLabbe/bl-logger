# bl-logger

This is a simple logging library for use with Node.js. It sends log messages, levels and metadata to "destinations" that you specify. For example, bl-logger currently includes 3 destinations, one to log to console, one to log to a file, and one to log to an HTTP URL that accepts JSON.

Custom destinations should simply be an object with a `log` method that takes 3 arguments: `loglevel`, `message` and `metadata`. The `Logger` instance filters the messages by `loglevel`. `loglevel` is passed to the destinations for purposes of outputting the log levels if desired. See the provided destinations for how metadata can be handled.
