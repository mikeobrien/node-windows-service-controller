var _ = require('lodash');

_.mixin(require('underscore.string').exports());

function qualifyUNCPath(path) {
    return '\\\\' + _.ltrim(path, '\\');
}

function getArgs(args, fixed) {
    argsIn = _.toArray(args);
    var server, options;
    if (_.isObject(_.last(argsIn)) && !_.isArray(_.last(argsIn))) 
        options = argsIn.pop();
    if (argsIn.length === fixed) server = argsIn.shift();
    var argsOut = { 
        args: argsIn,
        options: options || {}
    };
    if (server) argsOut.server = server; 
    return argsOut;
}

function buildCommand(commandName, server, argsIn) {
    var argsOut = [];
    if (server) argsOut.push(qualifyUNCPath(server));
    argsOut.push(commandName);
    if (argsIn) {
        if (_.isArray(argsIn))
            argsOut.push.apply(argsOut, argsIn);
        else argsOut.push(argsIn);
    }
    return {
        path: 'sc',
        args: argsOut
    };
}

function buildSimpleCommand(commandName, args, fixed, buffer) {
    var argsIn = getArgs(args, fixed);
    if (buffer) argsIn.args.push(String(buffer));
    return buildCommand(commandName, argsIn.server, argsIn.args);
}

function addArg(args, name, value) {
    if (value) args.push(name + '=', String(value));
}

function toYesNo(value) {
    if (value === true) return 'yes';
    if (value === false) return 'no';
    return value;
}

function toSlashSeperated(value) {
    return value ? value.join('/') : value;
}

function buildControlCommand(args, commandName) {
    var argsIn = getArgs(args, 2);
    var services = _.isArray(argsIn.args[0]) ? argsIn.args[0] : [ argsIn.args[0] ];

    var command = {
        command: commandName,
        serial: !!argsIn.options.serial,
        commands: services.map(function(service) {
            var argsOut = [ service ];
            if (argsIn.options.args) argsOut.push.apply(argsOut, argsIn.options.args);
            var command = buildCommand(commandName, argsIn.server, argsOut);
            command.service = service;
            return command;
        })
    };
    if (argsIn.server) command.server = argsIn.server;
    return command;
}

function addConfigArgs(args, options) {
    addArg(args, 'type', options.type);
    addArg(args, 'type', options.interact);
    addArg(args, 'start', options.start);
    addArg(args, 'error', options.error);
    addArg(args, 'binpath', options.binpath);
    addArg(args, 'group', options.group);
    addArg(args, 'tag', toYesNo(options.tag));
    addArg(args, 'depend', toSlashSeperated(options.depend));
    addArg(args, 'obj', options.obj);
    addArg(args, 'displayname', options.displayname);
    addArg(args, 'password', options.password);
}

// ********** Control *******************

exports.start = function(args) {
    return buildControlCommand(args, 'start');
};

exports.pause = function(args) {
    return buildControlCommand(args, 'pause');
};

exports.continue = function(args) {
    return buildControlCommand(args, 'continue');
};

exports.stop = function(args) {
    return buildControlCommand(args, 'stop');
};

exports.control = function(args) {
    return buildSimpleCommand('control', args, 3);
};

exports.interrogate = function(args) {
    return buildSimpleCommand('interrogate', args, 2);
};

// ********** Management *******************

exports.create = function(args) {
    var argsIn = getArgs(args, 2);
    var argsOut = [ argsIn.args[0] ];
    addConfigArgs(argsOut, argsIn.options);
    return buildCommand('create', argsIn.server, argsOut);
};

exports.getDisplayName = function(args) {
    return buildSimpleCommand('getdisplayname', args, 2, 4096);
};

exports.getKeyName = function(args) {
    return buildSimpleCommand('getkeyname', args, 2, 4096);
};

exports.getDescription = function(args) {
    return buildSimpleCommand('qdescription', args, 2, 8192);
};

exports.setDescription = function(args) {
    return buildSimpleCommand('description', args, 3);
};

exports.getDependencies = function(args) {
    return buildSimpleCommand('enumdepend', args, 2, 262144);
};

exports.setDescriptor = function(args) {
    return buildSimpleCommand('sdset', args, 3);
};

exports.getDescriptor = function(args) {
    return buildSimpleCommand('sdshow', args, 2);
};

exports.getConfig = function(args) {
    return buildSimpleCommand('qc', args, 2, 8192);
};

exports.setConfig = function(args) {
    var argsIn = getArgs(args, 2);
    var argsOut = [ argsIn.args[0] ];
    addConfigArgs(argsOut, argsIn.options);
    return buildCommand('config', argsIn.server, argsOut);
};

exports.getFailureConfig = function(args) {
    return buildSimpleCommand('qfailure', args, 2, 8192);
};

exports.setFailureConfig = function(args) {
    var argsIn = getArgs(args, 2);
    var argsOut = [ argsIn.args[0] ];
    var options = argsIn.options;
    addArg(argsOut, 'reset', options.reset);
    addArg(argsOut, 'reboot', options.reboot);
    addArg(argsOut, 'command', options.command);
    if (options.actions) {
        var actions = [];
        if (options.actions.restart) 
            actions.push('restart', options.actions.restart);
        if (options.actions.run) 
            actions.push('run', options.actions.run);
        if (options.actions.reboot) 
            actions.push('reboot', options.actions.reboot);
        if (actions.length > 0)
            addArg(argsOut, 'actions', toSlashSeperated(actions));
    }
    return buildCommand('failure', argsIn.server, argsOut);
};

exports.query = function(args) {
    var argsIn = getArgs(args, 1);
    var argsOut = [];
    if (argsIn.options.name) argsOut.push(argsIn.options.name);
    else {
        addArg(argsOut, 'type', argsIn.options.class);
        addArg(argsOut, 'type', argsIn.options.type);
        addArg(argsOut, 'state', argsIn.options.state);
        addArg(argsOut, 'group', argsIn.options.group); 
        addArg(argsOut, 'bufsize', 262144);    
    }
    return buildCommand('queryex', argsIn.server, argsOut);
};

exports.delete = function(args) {
    return buildSimpleCommand('delete', args, 2);
};

// ********** System *******************

exports.setBoot = function(args) {
    return buildSimpleCommand('boot', args, 2);
};

exports.lock = function(args) {
    return buildSimpleCommand('lock', args, 1);
};

exports.getLock = function(args) {
    return buildSimpleCommand('querylock', args, 1);
};