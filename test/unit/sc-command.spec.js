var expect = require('chai').expect,
    _ = require('lodash'),
    sc = require('../../src/sc-command');

describe('sc-command', function() {

    var buildCommand = function(args, service, successCodes, server) {
        var command = { path: 'sc', args: args, successCodes: successCodes || [] };
        if (service) command.service = service;
        if (server) command.server = server;
        return command;
    };

    // *************************** CONTROL ***************************

    var buildControlCommand = function(commandName, commands, server, options) {
        var command = _.merge({ command: commandName, commands: commands }, options);
        if (server) command.server = server;
        return command;
    };

    describe('start', function() {

        it('should be valid with minimal args', function() {

            var start = sc.start(['servicename']);

            expect(start).to.deep.equal(buildControlCommand('start', [
                buildCommand([ 'start', 'servicename' ], 'servicename', [ 1056 ]) 
            ]));

        });

        it('should be valid with minimal args and multiple services', function() {

            var start = sc.start([['servicename1', 'servicename2']]);

            expect(start).to.deep.equal(buildControlCommand('start', [
                buildCommand([ 'start', 'servicename1' ], 'servicename1', [ 1056 ]),
                buildCommand([ 'start', 'servicename2' ], 'servicename2', [ 1056 ])
            ]));

        });

        it('should be valid with server and minimal args', function() {

            var start = sc.start(['myserver', 'servicename', { serial: true }]);

            expect(start).to.deep.equal(buildControlCommand('start', [
                buildCommand([ '\\\\myserver', 'start', 'servicename' ], 'servicename', [ 1056 ], 'myserver')
            ], 'myserver', { serial: true }));

        });

        it('should be valid with server and minimal args and multiple services', function() {

            var start = sc.start(['myserver', ['servicename1', 'servicename2'], { serial: true }]);

            expect(start).to.deep.equal(buildControlCommand('start', [
                buildCommand([ '\\\\myserver', 'start', 'servicename1' ], 'servicename1', [ 1056 ], 'myserver'),
                buildCommand([ '\\\\myserver', 'start', 'servicename2' ], 'servicename2', [ 1056 ], 'myserver')
            ], 'myserver', { serial: true }));

        });

        it('should be valid with all args', function() {

            var start = sc.start(['myserver', 'servicename', {
                args: ['Service', 'Arguments'], serial: true
            }]);

            expect(start).to.deep.equal(buildControlCommand('start', [
                buildCommand([ '\\\\myserver', 'start', 'servicename', 'Service', 'Arguments' ], 
                               'servicename', [ 1056 ], 'myserver')
            ], 'myserver', { args: ['Service', 'Arguments'], serial: true }));

        });

        it('should be valid with all args and multiple services', function() {

            var start = sc.start(['myserver', ['servicename1', 'servicename2'], {
                args: ['Service', 'Arguments'], serial: true
            }]);

            expect(start).to.deep.equal(buildControlCommand('start', [
                buildCommand([ '\\\\myserver', 'start', 'servicename1', 'Service', 'Arguments' ], 
                               'servicename1', [ 1056 ], 'myserver'),
                buildCommand([ '\\\\myserver', 'start', 'servicename2', 'Service', 'Arguments' ], 
                               'servicename2', [ 1056 ], 'myserver')
            ], 'myserver', { args: ['Service', 'Arguments'], serial: true }));

        });

    });

    describe('pause', function() {

        it('should be valid with minimal args', function() {

            var pause = sc.pause(['servicename']);

            expect(pause).to.deep.equal(buildControlCommand('pause', [
                buildCommand([ 'pause', 'servicename' ], 'servicename')
            ]));

        });

        it('should be valid with minimal args and multiple services', function() {

            var pause = sc.pause([['servicename1', 'servicename2']]);

            expect(pause).to.deep.equal(buildControlCommand('pause', [
                buildCommand([ 'pause', 'servicename1' ], 'servicename1'),
                buildCommand([ 'pause', 'servicename2' ], 'servicename2')
            ]));

        });

        it('should be valid with all args', function() {

            var pause = sc.pause(['myserver', 'servicename', { serial: true }]);

            expect(pause).to.deep.equal(buildControlCommand('pause', [
                buildCommand([ '\\\\myserver', 'pause', 'servicename' ], 'servicename', null, 'myserver')
            ], 'myserver', { serial: true }));

        });

        it('should be valid with all args and multiple services', function() {

            var pause = sc.pause(['myserver', ['servicename1', 'servicename2'], { serial: true }]);

            expect(pause).to.deep.equal(buildControlCommand('pause', [
                buildCommand([ '\\\\myserver', 'pause', 'servicename1' ], 'servicename1', null, 'myserver'),
                buildCommand([ '\\\\myserver', 'pause', 'servicename2' ], 'servicename2', null, 'myserver')
            ], 'myserver', { serial: true }));

        });

    });

    describe('continue', function() {

        it('should be valid with minimal args', function() {

            var cont = sc.continue(['servicename']);

            expect(cont).to.deep.equal(buildControlCommand('continue', [
                buildCommand([ 'continue', 'servicename' ], 'servicename')
            ]));

        });

        it('should be valid with minimal args and multiple services', function() {

            var cont = sc.continue([['servicename1', 'servicename2']]);

            expect(cont).to.deep.equal(buildControlCommand('continue', [
                buildCommand([ 'continue', 'servicename1' ], 'servicename1'),
                buildCommand([ 'continue', 'servicename2' ], 'servicename2')
            ]));

        });

        it('should be valid with all args', function() {

            var cont = sc.continue(['myserver', 'servicename', { serial: true }]);

            expect(cont).to.deep.equal(buildControlCommand('continue', [
                buildCommand([ '\\\\myserver', 'continue', 'servicename' ], 'servicename', null, 'myserver')
            ], 'myserver', { serial: true }));

        });

        it('should be valid with all args and multiple services', function() {

            var cont = sc.continue(['myserver', ['servicename1', 'servicename2'], { serial: true }]);

            expect(cont).to.deep.equal(buildControlCommand('continue', [
                buildCommand([ '\\\\myserver', 'continue', 'servicename1' ], 'servicename1', null, 'myserver'),
                buildCommand([ '\\\\myserver', 'continue', 'servicename2' ], 'servicename2', null, 'myserver')
            ], 'myserver', { serial: true }));

        });

    });

    describe('stop', function() {

        it('should be valid with minimal args', function() {

            var stop = sc.stop(['servicename']);

            expect(stop).to.deep.equal(buildControlCommand('stop', [
                buildCommand([ 'stop', 'servicename' ], 'servicename', [ 1062 ])
            ]));

        });

        it('should be valid with minimal args and multiple services', function() {

            var stop = sc.stop([['servicename1', 'servicename2']]);

            expect(stop).to.deep.equal(buildControlCommand('stop', [
                buildCommand([ 'stop', 'servicename1' ], 'servicename1', [ 1062 ]),
                buildCommand([ 'stop', 'servicename2' ], 'servicename2', [ 1062 ])
            ]));

        });

        it('should be valid with all args', function() {

            var stop = sc.stop(['myserver', 'servicename', { serial: true, waitForExit: true }]);

            expect(stop).to.deep.equal(buildControlCommand('stop', [
                buildCommand([ '\\\\myserver', 'stop', 'servicename' ], 'servicename', [ 1062 ], 'myserver')
            ], 'myserver', { serial: true, waitForExit: true }));

        });

        it('should be valid with all args and multiple services', function() {

            var stop = sc.stop(['myserver', ['servicename1', 'servicename2'], { serial: true, waitForExit: true }]);

            expect(stop).to.deep.equal(buildControlCommand('stop', [
                buildCommand([ '\\\\myserver', 'stop', 'servicename1' ], 'servicename1', [ 1062 ], 'myserver'),
                buildCommand([ '\\\\myserver', 'stop', 'servicename2' ], 'servicename2', [ 1062 ], 'myserver')
            ], 'myserver', { serial: true, waitForExit: true }));

        });

    });

    describe('control', function() {

        it('should be valid with minimal args', function() {

            expect(sc.control(['servicename', 'paramchange'])).to.deep.equal(
                buildCommand([ 'control', 'servicename', 'paramchange' ]));

        });

        it('should be valid with all args', function() {

            expect(sc.control(['myserver', 'servicename', 'paramchange'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'control', 'servicename', 'paramchange' ]));

        });

    });

    describe('interrogate', function() {

        it('should be valid with minimal args', function() {

            expect(sc.interrogate(['servicename'])).to.deep.equal(
                buildCommand([ 'interrogate', 'servicename' ]));

        });

        it('should be valid with all args', function() {

            expect(sc.interrogate(['myserver', 'servicename'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'interrogate', 'servicename' ]));

        });

    });

    // *************************** MANAGEMENT ***************************

    describe('create', function() {

        it('should be valid with minimal args', function() {

            expect(sc.create(['servicename', { type: 'own' }])).to.deep.equal(
                buildCommand([ 'create', 'servicename', 'type=', 'own' ]));

        });

        it('should be valid with all args', function() {

            expect(sc.create(['myserver', 'servicename', {
                type: 'interact', 
                interact: 'share',
                start: 'boot',
                error: 'normal',
                binpath: 'path/to/service',
                group: 'LoadOrderGroup',
                tag: true,
                depend: [ 'Dependency1', 'Dependency2' ],
                obj: 'AccountName',
                displayname: 'DisplayName',
                password: 'Password'
            }])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'create', 'servicename',
                    'type=', 'interact', 
                    'type=', 'share',
                    'start=', 'boot', 
                    'error=', 'normal',
                    'binpath=', 'path/to/service', 
                    'group=', 'LoadOrderGroup',
                    'tag=', 'yes',
                    'depend=', 'Dependency1/Dependency2',
                    'obj=', 'AccountName',
                    'displayname=', 'DisplayName',
                    'password=', 'Password'
                ]));

        });

    });

    describe('getDisplayName', function() {

        it('should be valid with minimal args', function() {

            expect(sc.getDisplayName(['servicename'])).to.deep.equal(
                buildCommand([ 'getdisplayname', 'servicename', '4096' ]));

        });

        it('should be valid with all args', function() {

            expect(sc.getDisplayName(['myserver', 'servicename'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'getdisplayname', 'servicename', '4096' ]));

        });

    });

    describe('getKeyName', function() {

        it('should be valid with minimal args', function() {

            expect(sc.getKeyName(['servicename'])).to.deep.equal(
                buildCommand([ 'getkeyname', 'servicename', '4096' ]));

        });

        it('should be valid with all args', function() {

            expect(sc.getKeyName(['myserver', 'servicename'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'getkeyname', 'servicename', '4096' ]));

        });

    });

    describe('getDescription', function() {

        it('should be valid with minimal args', function() {

            expect(sc.getDescription(['servicename'])).to.deep.equal(
                buildCommand([ 'qdescription', 'servicename', '8192' ]));

        });

        it('should be valid with all args', function() {

            expect(sc.getDescription(['myserver', 'servicename'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'qdescription', 'servicename', '8192' ]));

        });

    });

    describe('setDescription', function() {

        it('should be valid with minimal args', function() {

            expect(sc.setDescription(['servicename', 'Some description.'])).to.deep.equal(
                buildCommand([ 'description', 'servicename', 'Some description.' ]));

        });

        it('should be valid with all args', function() {

            expect(sc.setDescription(['myserver', 'servicename', 'Some description.'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'description', 'servicename', 'Some description.' ]));

        });

    });

    describe('getDependencies', function() {

        it('should be valid with minimal args', function() {

            expect(sc.getDependencies(['servicename'])).to.deep.equal(
                buildCommand([ 'enumdepend', 'servicename', '262144' ]));

        });

        it('should be valid with all args', function() {

            expect(sc.getDependencies(['myserver', 'servicename'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'enumdepend', 'servicename', '262144' ]));

        });

    });

    describe('getDescriptor', function() {

        it('should be valid with minimal args', function() {

            expect(sc.getDescriptor(['servicename'])).to.deep.equal(
                buildCommand([ 'sdshow', 'servicename' ]));

        });

        it('should be valid with all args', function() {

            expect(sc.getDescriptor(['myserver', 'servicename'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'sdshow', 'servicename' ]));

        });

    });

    describe('setDescriptor', function() {

        it('should be valid with minimal args', function() {

            expect(sc.setDescriptor(['servicename', 'ServiceSecurityDescriptor'])).to.deep.equal(
                buildCommand([ 'sdset', 'servicename', 'ServiceSecurityDescriptor' ]));

        });

        it('should be valid with all args', function() {

            expect(sc.setDescriptor(['myserver', 'servicename', 'ServiceSecurityDescriptor'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'sdset', 'servicename', 'ServiceSecurityDescriptor' ]));

        });

    });

    describe('getConfig', function() {

        it('should be valid with minimal args', function() {

            expect(sc.getConfig(['servicename'])).to.deep.equal(
                buildCommand([ 'qc', 'servicename', '8192' ]));

        });

        it('should be valid with all args', function() {

            expect(sc.getConfig(['myserver', 'servicename'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'qc', 'servicename', '8192' ]));

        });

    });

    describe('setConfig', function() {

        it('should be valid with minimal args', function() {

            expect(sc.setConfig(['servicename', { type: 'own' }])).to.deep.equal(
                buildCommand([ 'config', 'servicename', 'type=', 'own' ]));

        });

        it('should be valid with all args', function() {

            expect(sc.setConfig(['myserver', 'servicename', {
                type: 'interact', 
                interact: 'share',
                start: 'boot',
                error: 'normal',
                binpath: 'path/to/service',
                group: 'LoadOrderGroup',
                tag: true,
                depend: [ 'Dependency1', 'Dependency2' ],
                obj: 'AccountName',
                displayname: 'DisplayName',
                password: 'Password'
            }])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'config', 'servicename',
                    'type=', 'interact', 
                    'type=', 'share',
                    'start=', 'boot', 
                    'error=', 'normal',
                    'binpath=', 'path/to/service', 
                    'group=', 'LoadOrderGroup',
                    'tag=', 'yes',
                    'depend=', 'Dependency1/Dependency2',
                    'obj=', 'AccountName',
                    'displayname=', 'DisplayName',
                    'password=', 'Password'
                ]));

        });

    });

    describe('getFailureConfig', function() {

        it('should be valid with minimal args', function() {

            expect(sc.getFailureConfig(['servicename'])).to.deep.equal(
                buildCommand([ 'qfailure', 'servicename', '8192' ]));

        });

        it('should be valid with all args', function() {

            expect(sc.getFailureConfig(['myserver', 'servicename'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'qfailure', 'servicename', '8192' ]));

        });

    });

    describe('setFailureConfig', function() {

        it('should be valid with minimal args', function() {

            expect(sc.setFailureConfig(['servicename', { reset: 30 }])).to.deep.equal(
                buildCommand([ 'failure', 'servicename', 'reset=', '30' ]));

        });

        it('should be valid with all args', function() {

            expect(sc.setFailureConfig(['myserver', 'servicename', {
                reset: 30, 
                reboot: 'Broadcast message',  
                command: 'path/to/failure.exe',
                actions: {
                    restart: 5000,
                    run: 10000,
                    reboot: 60000
                }
            }])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'failure', 'servicename',
                    'reset=', '30', 
                    'reboot=', 'Broadcast message',
                    'command=', 'path/to/failure.exe', 
                    'actions=', 'restart/5000/run/10000/reboot/60000'
                ]));

        });

    });

    describe('query', function() {

        it('should be valid with minimal args', function() {

            expect(sc.query()).to.deep.equal(
                buildCommand([ 'queryex', 'bufsize=', '262144' ]));

        });

        it('should be valid with server and minimal args', function() {

            expect(sc.query(['myserver'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'queryex', 'bufsize=', '262144' ]));

        });

        it('should not include args if service name is specified', function() {

            expect(sc.query(['myserver', {
                name: 'servicename',
                class: 'service', 
                type: 'interact', 
                state: 'inactive',  
                group: 'GroupName'
            }])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'queryex', 'servicename' ]));

        });

        it('should be specify all args when service name is not specified', function() {

            expect(sc.query(['myserver', {
                class: 'service', 
                type: 'interact', 
                state: 'inactive',  
                group: 'GroupName'
            }])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'queryex', 
                    'type=', 'service', 
                    'type=', 'interact', 
                    'state=', 'inactive',
                    'group=', 'GroupName',
                    'bufsize=', '262144'
                ]));

        });

    });

    describe('delete', function() {

        it('should be valid with minimal args', function() {

            expect(sc.delete(['servicename'])).to.deep.equal(
                buildCommand([ 'delete', 'servicename' ]));

        });

        it('should be valid with all args', function() {

            expect(sc.delete(['myserver', 'servicename'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'delete', 'servicename' ]));

        });

    });

    // *************************** SYSTEM ***************************

    describe('lock', function() {

        it('should be valid with minimal args', function() {

            expect(sc.lock()).to.deep.equal(
                buildCommand([ 'lock' ]));

        });

        it('should be valid with all args', function() {

            expect(sc.lock(['myserver'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'lock' ]));

        });

    });

    describe('getLock', function() {

        it('should be valid with minimal args', function() {

            expect(sc.getLock()).to.deep.equal(
                buildCommand([ 'querylock' ]));

        });

        it('should be valid with all args', function() {

            expect(sc.getLock(['myserver'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'querylock' ]));

        });

    });

    describe('setBoot', function() {

        it('should be valid with minimal args', function() {

            expect(sc.setBoot(['ok'])).to.deep.equal(
                buildCommand([ 'boot', 'ok' ]));

        });

        it('should be valid with all args', function() {

            expect(sc.setBoot(['myserver', 'ok'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'boot', 'ok' ]));

        });

    });

});
