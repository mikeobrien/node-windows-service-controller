var expect = require('chai').expect,
    tasklist = require('../../src/tasklist-command');

describe('tasklist-command', function() {

    it('should build command without server', function() {

        expect(tasklist('service'))
            .to.deep.equal({
                path: 'tasklist',
                args: [ '/FO', 'CSV', '/NH', '/FI', 'Services eq service' ],
                successCodes: []
            });

    });

    it('should build command with server', function() {

        expect(tasklist('service', 'server'))
            .to.deep.equal({
                path: 'tasklist',
                args: [ '/FO', 'CSV', '/NH', '/FI', 'Services eq service', '/S', 'server' ],
                successCodes: []
            });

    });

});
