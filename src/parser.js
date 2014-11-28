var _ = require('lodash'),
    escapeRegex = require('escape-string-regexp');

_.mixin(require('underscore.string').exports());

function getNameValueRegex(name, value, flags) {
    return new RegExp(escapeRegex(name) + '\\s*[=:]\\s*' + value, flags);
}

function matchGroupOrDefault(source, regex, defaultValue) {
    var result = source.match(regex);
    return result && result.length > 1 ? _.trim(result[1]) : defaultValue;
}

function getValue(source, name, defaultValue) {
    return matchGroupOrDefault(source, 
        getNameValueRegex(name, '(.*)'), defaultValue);
}

function getCodeNameValue(source, name, defaultValue) {
    return matchGroupOrDefault(source, 
        getNameValueRegex(name, '\\d*\\s*(.*)'), defaultValue);
}

function getFlags(source, name) {
    return matchGroupOrDefault(source, 
        new RegExp(escapeRegex(name) + '\\s*:\\s.*\\s*\\((.*)\\)'));
}

function getArrayValue(source, name) {
    source = matchGroupOrDefault(source, 
        new RegExp(escapeRegex(name) + '((\\s*:\\s*.*)*)'));
    if (!source) return [];
    var regex = /\s*:\s*(.*)/g;
    var results = [];
    var match;
    while (match = regex.exec(source)) {
        results.push(match[1]); 
    }
    return results;
}

function getNumericValue(source, name, hex, defaultValue) {
    var value = matchGroupOrDefault(source, 
        getNameValueRegex(name, '((0x)?\\d*)'), defaultValue);
    if (hex && !_.startsWith('0x')) value = '0x' + value;
    return parseInt(value);
}

function getHexValue(source, name, defaultValue) {
    return parseInt(getValue(source, name, defaultValue));
}

function getBooleanValue(source, name, defaultValue) {
    return Boolean(matchGroupOrDefault(source, 
        getNameValueRegex(name, '(true|false)', 'i'), defaultValue));
}

exports.error = function(output) {
    var result = getValue(output, 'ERROR') ||
                 matchGroupOrDefault(output, /^\[SC\].*\s*(.*)/);
    return result || output;
};

exports.displayName = function(output) {
    return getValue(output, 'Name', output);
};

exports.keyName = function(output) {
    return getValue(output, 'Name', output);
};

exports.description = function(output) {
    return getValue(output, 'DESCRIPTION', output);
};

exports.descriptor = function(output) {
    return matchGroupOrDefault(output, /\s*(.*)\s*/, output);
};

exports.lock = function(output) {
    return {
        locked: getBooleanValue(output, 'IsLocked', false),
        owner: getValue(output, 'LockOwner', ''),
        duration: getNumericValue(output, 'LockDuration', false, 0)
    };
};

exports.failureConfig = function(output) {
    return {
        resetPeriod: getNumericValue(output, 'RESET_PERIOD (in seconds)', false, 0),
        rebootMessage: getValue(output, 'REBOOT_MESSAGE', ''),
        commandLine: getValue(output, 'COMMAND_LINE', ''),
        failureActions: getValue(output, 'FAILURE_ACTIONS', '')
    };
};

exports.config = function(output) {
    return {
        type: { 
            code: getNumericValue(output, 'TYPE', true, 0), 
            name: getCodeNameValue(output, 'TYPE', '')
        },
        startType: { 
            code: getNumericValue(output, 'START_TYPE', true, 0), 
            name: getCodeNameValue(output, 'START_TYPE', '')
        },
        errorControl: { 
            code: getNumericValue(output, 'ERROR_CONTROL', true, 0), 
            name: getCodeNameValue(output, 'ERROR_CONTROL', '')
        },
        binPath: getValue(output, 'BINARY_PATH_NAME', ''),
        loadOrderGroup: getValue(output, 'LOAD_ORDER_GROUP', ''),
        tag: getNumericValue(output, 'TAG', false, 0),
        displayName: getValue(output, 'DISPLAY_NAME', ''),
        dependencies: getArrayValue(output, 'DEPENDENCIES'),
        serviceStartName: getValue(output, 'SERVICE_START_NAME', '')
    };
};

exports.services = function(output) {
    return output.split(/\r?\n\r?\n/)
        .filter(function(output) { return /SERVICE_NAME/.test(output); })
        .map(function(output) {
            var state = getNumericValue(output, 'STATE', true, 0);
            var service = {
                name: getValue(output, 'SERVICE_NAME', ''),
                displayName: getValue(output, 'DISPLAY_NAME', ''),
                type: { 
                    code: getNumericValue(output, 'TYPE', true, 0), 
                    name: getCodeNameValue(output, 'TYPE', '')
                },
                state: { 
                    code: state, 
                    name: getCodeNameValue(output, 'STATE', ''),
                    running: state === 4,
                    paused: state === 7,
                    stopped: state === 1
                },
                win32ExitCode: getNumericValue(output, 'WIN32_EXIT_CODE', false, 0),
                serviceExitCode: getNumericValue(output, 'SERVICE_EXIT_CODE', false, 0),
                checkpoint: getHexValue(output, 'CHECKPOINT', 0),
                waitHint: getHexValue(output, 'WAIT_HINT', 0)
            };
            var accepted = getFlags(output, 'STATE');
            var pid = getNumericValue(output, 'PID', false, null);
            var flags = getValue(output, 'FLAGS', null);
            if (accepted) service.accepted = accepted.split(', ');
            if (pid) service.pid = pid;
            if (flags) service.flags = flags;
            return service;
        });
};