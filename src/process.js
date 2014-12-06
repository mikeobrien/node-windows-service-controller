var process = require('child_process'),
    Q = require('q');

module.exports = function(command, errorParser, successParser) {

    console.log();
    console.log(command.path + ' ' + command.args.join(' '));
    console.log();

    var sc = process.spawn(command.path, command.args);

    var log = function(message) { 
        message = message.toString('utf8');
        console.log(message); 
        return message;
    };

    var stdout = '';

    sc.stdout.on('data', function(message) { stdout += log(message); });

    var deferred = Q.defer();

    sc.on('exit', function(code) { 
        if (code !== 0 && command.successCodes.indexOf(code) == -1) 
            deferred.reject(errorParser(stdout));
        else if (successParser) deferred.resolve(successParser(stdout));
        else deferred.resolve();
    });

    return deferred.promise;   

};