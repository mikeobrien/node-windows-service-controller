var command = require('./command'),
    parse = require('./parser'),
    process = require('./process'),
    coordinator = require('./coordinator'),
    Q = require('q');

function run(command, successParser) {
    return process(command, parse.error, successParser);
}

// *************************** CONTROL ***************************

var PAUSED = 7;
var RUNNING = 4;
var STOPPED = 1;

var _timeout = 30;

function runControl(control, status) {
    return coordinator.poll(control.commands, 1000, _timeout * 1000, control.serial,
        function(command) { return run(command); },
        function(command) { return query(control.server, { name: command.service }); },
        function(services) { return services[0].state.code === status; },
        function(command) { return 'Timed out attempting to ' + control.command + ' ' + command.service + '.'; });
}

module.exports.timeout = function(timeout) {
    _timeout = timeout;
};

module.exports.start = function() {
    return runControl(command.start(arguments), RUNNING);
};

module.exports.pause = function() {
    return runControl(command.pause(arguments), PAUSED);
};

module.exports.continue = function() {
    return runControl(command.continue(arguments), RUNNING);
};

module.exports.stop = function() {
    return runControl(command.stop(arguments), STOPPED);
};

module.exports.control = function() {
    return run(command.control(arguments));
};

module.exports.interrogate = function() {
    return run(command.interrogate(arguments));
};

// *************************** MANAGEMENT ***************************

module.exports.create = function() {
    return run(command.create(arguments));
};

module.exports.getDisplayName = function() {
    return run(command.getDisplayName(arguments), parse.displayName);
};

module.exports.getKeyName = function() {
    return run(command.getKeyName(arguments), parse.keyName);
};

module.exports.getDescription = function() {
    return run(command.getDescription(arguments), parse.description);
};

module.exports.setDescription = function() {
    return run(command.setDescription(arguments));
};

module.exports.getDependencies = function() {
    return run(command.getDependencies(arguments), parse.services);
};

module.exports.getDescriptor = function() {
    return run(command.getDescriptor(arguments), parse.descriptor);
};

module.exports.setDescriptor = function() {
    return run(command.setDescriptor(arguments));
};

module.exports.getConfig = function() {
    return run(command.getConfig(arguments), parse.config);
};

module.exports.setConfig = function() {
    return run(command.setConfig(arguments));
};

module.exports.getFailureConfig = function() {
    return run(command.getFailureConfig(arguments), parse.failureConfig);
};

module.exports.setFailureConfig = function() {
    return run(command.setFailureConfig(arguments));
};

function query() {
    return run(command.query(arguments), parse.services);
};

module.exports.query = query;

module.exports.delete = function() {
    return run(command.delete(arguments));
};

// *************************** SYSTEM ***************************

module.exports.setBoot = function() {
    return run(command.setBoot(arguments));
};

module.exports.lock = function() {
    return run(command.lock(arguments));
};

module.exports.getLock = function() {
    return run(command.getLock(arguments), parse.lock);
};