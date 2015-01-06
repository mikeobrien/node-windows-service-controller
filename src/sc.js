var sc = require('./sc-command'),
    tasklist = require('./tasklist-command'),
    scParser = require('./sc-parser'),
    tasklistParser = require('./tasklist-parser'),
    process = require('./process'),
    coordinator = require('./coordinator'),
    Q = require('q');

function runSc(command, successParser) {
    return process(command, scParser.error, successParser);
}

function runTasklist(command, successParser) {
    return process(command, function(x) { return x; }, tasklistParser);
}

// *************************** CONTROL ***************************

var PAUSED = 7;
var RUNNING = 4;
var STOPPED = 1;

var timeout = 30000;
var pollInterval = 1000;

function runPoll(control, poll, predicate, errorMessage) {
    return coordinator.poll(
        control.commands, pollInterval, timeout, control.serial,
        function(command) { return runSc(command); },
        poll, predicate, errorMessage);
}

function runControl(control, status) {
    return runPoll(control,
        function(command) { return query(control.server, { name: command.service }); },
        function(services) { return services[0].state.code === status; },
        function(command) { return 'Timed out attempting to ' + 
            control.command + ' ' + command.service + '.'; });
}

module.exports.timeout = function(second) {
    timeout = second * 1000;
};

module.exports.pollInterval = function(second) {
    pollInterval = second * 1000;
};

module.exports.start = function() {
    return runControl(sc.start(arguments), RUNNING);
};

module.exports.pause = function() {
    return runControl(sc.pause(arguments), PAUSED);
};

module.exports.continue = function() {
    return runControl(sc.continue(arguments), RUNNING);
};

module.exports.stop = function() {
    var command = sc.stop(arguments);
    if (!command.waitForExit) return runControl(command, STOPPED);
    return runPoll(command,
        function(command) { return runTasklist(tasklist(command.service, command.server)); },
        function(processes) { return processes.length == 0; },
        function(command) { return 'Timed out waiting for the ' + 
            command.service + ' service process to terminate.'; });
};

module.exports.control = function() {
    return runSc(sc.control(arguments));
};

module.exports.interrogate = function() {
    return runSc(sc.interrogate(arguments));
};

// *************************** MANAGEMENT ***************************

module.exports.create = function() {
    return runSc(sc.create(arguments));
};

module.exports.getDisplayName = function() {
    return runSc(sc.getDisplayName(arguments), scParser.displayName);
};

module.exports.getKeyName = function() {
    return runSc(sc.getKeyName(arguments), scParser.keyName);
};

module.exports.getDescription = function() {
    return runSc(sc.getDescription(arguments), scParser.description);
};

module.exports.setDescription = function() {
    return runSc(sc.setDescription(arguments));
};

module.exports.getDependencies = function() {
    return runSc(sc.getDependencies(arguments), scParser.services);
};

module.exports.getDescriptor = function() {
    return runSc(sc.getDescriptor(arguments), scParser.descriptor);
};

module.exports.setDescriptor = function() {
    return runSc(sc.setDescriptor(arguments));
};

module.exports.getConfig = function() {
    return runSc(sc.getConfig(arguments), scParser.config);
};

module.exports.setConfig = function() {
    return runSc(sc.setConfig(arguments));
};

module.exports.getFailureConfig = function() {
    return runSc(sc.getFailureConfig(arguments), scParser.failureConfig);
};

module.exports.setFailureConfig = function() {
    return runSc(sc.setFailureConfig(arguments));
};

function query() {
    return runSc(sc.query(arguments), scParser.services);
};

module.exports.query = query;

module.exports.delete = function() {
    return runSc(sc.delete(arguments));
};

// *************************** SYSTEM ***************************

module.exports.setBoot = function() {
    return runSc(sc.setBoot(arguments));
};

module.exports.lock = function() {
    return runSc(sc.lock(arguments));
};

module.exports.getLock = function() {
    return runSc(sc.getLock(arguments), scParser.lock);
};