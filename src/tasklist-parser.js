var _ = require('lodash'),
    escapeRegex = require('escape-string-regexp');

_.mixin(require('underscore.string').exports());

module.exports = function(output) {
    if (output.match(/INFO: No tasks are running/)) return [];
    return output.split('\n').map(function(line) {
        var fields = line.trim().replace(/^"|"$/g, '').split('","');
        return {
            name: fields[0], 
            pid: parseInt(fields[1]), 
            sessionName: fields[2], 
            session: parseInt(fields[3]), 
            memory: fields[4]
        }
    });
};