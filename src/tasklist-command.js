module.exports = function(service, server) {
    var args = [ '/FO', 'CSV', '/NH', '/FI', 'Services eq ' + service ];
    if (server) args.push('/S', server);
    return {
        path: 'tasklist',
        args: args,
        successCodes: []
    };
}