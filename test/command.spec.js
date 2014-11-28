var expect = require('chai').expect,
    command = require('../src/command.js');

describe('command', function() {

    var buildCommand = function(args, service) {
        var command = { path: 'sc', args: args };
        if (service) command.service = service;
        return command;
    };

    // *************************** CONTROL ***************************

    var buildControlCommand = function(commandName, commands, server, serial) {
        var command = { command: commandName, serial: !!serial, commands: commands };
        if (server) command.server = server;
        return command;
    };

    describe('start', function() {

        it('should be valid with minimal args', function() {

            var start = command.start(['servicename']);

            expect(start).to.deep.equal(buildControlCommand('start', [
                buildCommand([ 'start', 'servicename' ], 'servicename') 
            ]));

        });

        it('should be valid with minimal args and multiple services', function() {

            var start = command.start([['servicename1', 'servicename2']]);

            expect(start).to.deep.equal(buildControlCommand('start', [
                buildCommand([ 'start', 'servicename1' ], 'servicename1'),
                buildCommand([ 'start', 'servicename2' ], 'servicename2')
            ]));

        });

        it('should be valid with server and minimal args', function() {

            var start = command.start(['myserver', 'servicename', { serial: true }]);

            expect(start).to.deep.equal(buildControlCommand('start', [
                buildCommand([ '\\\\myserver', 'start', 'servicename' ], 'servicename')
            ], 'myserver', true));

        });

        it('should be valid with server and minimal args and multiple services', function() {

            var start = command.start(['myserver', ['servicename1', 'servicename2'], { serial: true }]);

            expect(start).to.deep.equal(buildControlCommand('start', [
                buildCommand([ '\\\\myserver', 'start', 'servicename1' ], 'servicename1'),
                buildCommand([ '\\\\myserver', 'start', 'servicename2' ], 'servicename2')
            ], 'myserver', true));

        });

        it('should be valid with all args', function() {

            var start = command.start(['myserver', 'servicename', {
                args: ['Service', 'Arguments'], serial: true
            }]);

            expect(start).to.deep.equal(buildControlCommand('start', [
                buildCommand([ '\\\\myserver', 'start', 'servicename', 'Service', 'Arguments' ], 
                               'servicename')
            ], 'myserver', true));

        });

        it('should be valid with all args and multiple services', function() {

            var start = command.start(['myserver', ['servicename1', 'servicename2'], {
                args: ['Service', 'Arguments'], serial: true
            }]);

            expect(start).to.deep.equal(buildControlCommand('start', [
                buildCommand([ '\\\\myserver', 'start', 'servicename1', 'Service', 'Arguments' ], 
                               'servicename1', 'myserver'),
                buildCommand([ '\\\\myserver', 'start', 'servicename2', 'Service', 'Arguments' ], 
                               'servicename2')
            ], 'myserver', true));

        });

    });

    describe('pause', function() {

        it('should be valid with minimal args', function() {

            var pause = command.pause(['servicename']);

            expect(pause).to.deep.equal(buildControlCommand('pause', [
                buildCommand([ 'pause', 'servicename' ], 'servicename')
            ]));

        });

        it('should be valid with minimal args and multiple services', function() {

            var pause = command.pause([['servicename1', 'servicename2']]);

            expect(pause).to.deep.equal(buildControlCommand('pause', [
                buildCommand([ 'pause', 'servicename1' ], 'servicename1'),
                buildCommand([ 'pause', 'servicename2' ], 'servicename2')
            ]));

        });

        it('should be valid with all args', function() {

            var pause = command.pause(['myserver', 'servicename', { serial: true }]);

            expect(pause).to.deep.equal(buildControlCommand('pause', [
                buildCommand([ '\\\\myserver', 'pause', 'servicename' ], 'servicename')
            ], 'myserver', true));

        });

        it('should be valid with all args and multiple services', function() {

            var pause = command.pause(['myserver', ['servicename1', 'servicename2'], { serial: true }]);

            expect(pause).to.deep.equal(buildControlCommand('pause', [
                buildCommand([ '\\\\myserver', 'pause', 'servicename1' ], 'servicename1'),
                buildCommand([ '\\\\myserver', 'pause', 'servicename2' ], 'servicename2')
            ], 'myserver', true));

        });

    });

    describe('continue', function() {

        it('should be valid with minimal args', function() {

            var cont = command.continue(['servicename']);

            expect(cont).to.deep.equal(buildControlCommand('continue', [
                buildCommand([ 'continue', 'servicename' ], 'servicename')
            ]));

        });

        it('should be valid with minimal args and multiple services', function() {

            var cont = command.continue([['servicename1', 'servicename2']]);

            expect(cont).to.deep.equal(buildControlCommand('continue', [
                buildCommand([ 'continue', 'servicename1' ], 'servicename1'),
                buildCommand([ 'continue', 'servicename2' ], 'servicename2')
            ]));

        });

        it('should be valid with all args', function() {

            var cont = command.continue(['myserver', 'servicename', { serial: true }]);

            expect(cont).to.deep.equal(buildControlCommand('continue', [
                buildCommand([ '\\\\myserver', 'continue', 'servicename' ], 'servicename')
            ], 'myserver', true));

        });

        it('should be valid with all args and multiple services', function() {

            var cont = command.continue(['myserver', ['servicename1', 'servicename2'], { serial: true }]);

            expect(cont).to.deep.equal(buildControlCommand('continue', [
                buildCommand([ '\\\\myserver', 'continue', 'servicename1' ], 'servicename1'),
                buildCommand([ '\\\\myserver', 'continue', 'servicename2' ], 'servicename2')
            ], 'myserver', true));

        });

    });

    describe('stop', function() {

        it('should be valid with minimal args', function() {

            var stop = command.stop(['servicename']);

            expect(stop).to.deep.equal(buildControlCommand('stop', [
                buildCommand([ 'stop', 'servicename' ], 'servicename')
            ]));

        });

        it('should be valid with minimal args and multiple services', function() {

            var stop = command.stop([['servicename1', 'servicename2']]);

            expect(stop).to.deep.equal(buildControlCommand('stop', [
                buildCommand([ 'stop', 'servicename1' ], 'servicename1'),
                buildCommand([ 'stop', 'servicename2' ], 'servicename2')
            ]));

        });

        it('should be valid with all args', function() {

            var stop = command.stop(['myserver', 'servicename', { serial: true }]);

            expect(stop).to.deep.equal(buildControlCommand('stop', [
                buildCommand([ '\\\\myserver', 'stop', 'servicename' ], 'servicename')
            ], 'myserver', true));

        });

        it('should be valid with all args and multiple services', function() {

            var stop = command.stop(['myserver', ['servicename1', 'servicename2'], { serial: true }]);

            expect(stop).to.deep.equal(buildControlCommand('stop', [
                buildCommand([ '\\\\myserver', 'stop', 'servicename1' ], 'servicename1'),
                buildCommand([ '\\\\myserver', 'stop', 'servicename2' ], 'servicename2')
            ], 'myserver', true));

        });

    });

    describe('control', function() {

        it('should be valid with minimal args', function() {

            expect(command.control(['servicename', 'paramchange'])).to.deep.equal(
                buildCommand([ 'control', 'servicename', 'paramchange' ]));

        });

        it('should be valid with all args', function() {

            expect(command.control(['myserver', 'servicename', 'paramchange'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'control', 'servicename', 'paramchange' ]));

        });

    });

    describe('interrogate', function() {

        it('should be valid with minimal args', function() {

            expect(command.interrogate(['servicename'])).to.deep.equal(
                buildCommand([ 'interrogate', 'servicename' ]));

        });

        it('should be valid with all args', function() {

            expect(command.interrogate(['myserver', 'servicename'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'interrogate', 'servicename' ]));

        });

    });

    // *************************** MANAGEMENT ***************************

    describe('create', function() {

        it('should be valid with minimal args', function() {

            expect(command.create(['servicename', { type: 'own' }])).to.deep.equal(
                buildCommand([ 'create', 'servicename', 'type=', 'own' ]));

        });

        it('should be valid with all args', function() {

            expect(command.create(['myserver', 'servicename', {
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

            expect(command.getDisplayName(['servicename'])).to.deep.equal(
                buildCommand([ 'getdisplayname', 'servicename', '4096' ]));

        });

        it('should be valid with all args', function() {

            expect(command.getDisplayName(['myserver', 'servicename'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'getdisplayname', 'servicename', '4096' ]));

        });

    });

    describe('getKeyName', function() {

        it('should be valid with minimal args', function() {

            expect(command.getKeyName(['servicename'])).to.deep.equal(
                buildCommand([ 'getkeyname', 'servicename', '4096' ]));

        });

        it('should be valid with all args', function() {

            expect(command.getKeyName(['myserver', 'servicename'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'getkeyname', 'servicename', '4096' ]));

        });

    });

    describe('getDescription', function() {

        it('should be valid with minimal args', function() {

            expect(command.getDescription(['servicename'])).to.deep.equal(
                buildCommand([ 'qdescription', 'servicename', '8192' ]));

        });

        it('should be valid with all args', function() {

            expect(command.getDescription(['myserver', 'servicename'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'qdescription', 'servicename', '8192' ]));

        });

    });

    describe('setDescription', function() {

        it('should be valid with minimal args', function() {

            expect(command.setDescription(['servicename', 'Some description.'])).to.deep.equal(
                buildCommand([ 'description', 'servicename', 'Some description.' ]));

        });

        it('should be valid with all args', function() {

            expect(command.setDescription(['myserver', 'servicename', 'Some description.'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'description', 'servicename', 'Some description.' ]));

        });

    });

    describe('getDependencies', function() {

        it('should be valid with minimal args', function() {

            expect(command.getDependencies(['servicename'])).to.deep.equal(
                buildCommand([ 'enumdepend', 'servicename', '262144' ]));

        });

        it('should be valid with all args', function() {

            expect(command.getDependencies(['myserver', 'servicename'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'enumdepend', 'servicename', '262144' ]));

        });

    });

    describe('getDescriptor', function() {

        it('should be valid with minimal args', function() {

            expect(command.getDescriptor(['servicename'])).to.deep.equal(
                buildCommand([ 'sdshow', 'servicename' ]));

        });

        it('should be valid with all args', function() {

            expect(command.getDescriptor(['myserver', 'servicename'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'sdshow', 'servicename' ]));

        });

    });

    describe('setDescriptor', function() {

        it('should be valid with minimal args', function() {

            expect(command.setDescriptor(['servicename', 'ServiceSecurityDescriptor'])).to.deep.equal(
                buildCommand([ 'sdset', 'servicename', 'ServiceSecurityDescriptor' ]));

        });

        it('should be valid with all args', function() {

            expect(command.setDescriptor(['myserver', 'servicename', 'ServiceSecurityDescriptor'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'sdset', 'servicename', 'ServiceSecurityDescriptor' ]));

        });

    });

    describe('getConfig', function() {

        it('should be valid with minimal args', function() {

            expect(command.getConfig(['servicename'])).to.deep.equal(
                buildCommand([ 'qc', 'servicename', '8192' ]));

        });

        it('should be valid with all args', function() {

            expect(command.getConfig(['myserver', 'servicename'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'qc', 'servicename', '8192' ]));

        });

    });

    describe('setConfig', function() {

        it('should be valid with minimal args', function() {

            expect(command.setConfig(['servicename', { type: 'own' }])).to.deep.equal(
                buildCommand([ 'config', 'servicename', 'type=', 'own' ]));

        });

        it('should be valid with all args', function() {

            expect(command.setConfig(['myserver', 'servicename', {
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

            expect(command.getFailureConfig(['servicename'])).to.deep.equal(
                buildCommand([ 'qfailure', 'servicename', '8192' ]));

        });

        it('should be valid with all args', function() {

            expect(command.getFailureConfig(['myserver', 'servicename'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'qfailure', 'servicename', '8192' ]));

        });

    });

    describe('setFailureConfig', function() {

        it('should be valid with minimal args', function() {

            expect(command.setFailureConfig(['servicename', { reset: 30 }])).to.deep.equal(
                buildCommand([ 'failure', 'servicename', 'reset=', '30' ]));

        });

        it('should be valid with all args', function() {

            expect(command.setFailureConfig(['myserver', 'servicename', {
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

            expect(command.query()).to.deep.equal(
                buildCommand([ 'queryex', 'bufsize=', '262144' ]));

        });

        it('should be valid with server and minimal args', function() {

            expect(command.query(['myserver'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'queryex', 'bufsize=', '262144' ]));

        });

        it('should not include args if service name is specified', function() {

            expect(command.query(['myserver', {
                name: 'servicename',
                class: 'service', 
                type: 'interact', 
                state: 'inactive',  
                group: 'GroupName'
            }])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'queryex', 'servicename' ]));

        });

        it('should be specify all args when service name is not specified', function() {

            expect(command.query(['myserver', {
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

            expect(command.delete(['servicename'])).to.deep.equal(
                buildCommand([ 'delete', 'servicename' ]));

        });

        it('should be valid with all args', function() {

            expect(command.delete(['myserver', 'servicename'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'delete', 'servicename' ]));

        });

    });

    // *************************** SYSTEM ***************************

    describe('lock', function() {

        it('should be valid with minimal args', function() {

            expect(command.lock()).to.deep.equal(
                buildCommand([ 'lock' ]));

        });

        it('should be valid with all args', function() {

            expect(command.lock(['myserver'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'lock' ]));

        });

    });

    describe('getLock', function() {

        it('should be valid with minimal args', function() {

            expect(command.getLock()).to.deep.equal(
                buildCommand([ 'querylock' ]));

        });

        it('should be valid with all args', function() {

            expect(command.getLock(['myserver'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'querylock' ]));

        });

    });

    describe('setBoot', function() {

        it('should be valid with minimal args', function() {

            expect(command.setBoot(['ok'])).to.deep.equal(
                buildCommand([ 'boot', 'ok' ]));

        });

        it('should be valid with all args', function() {

            expect(command.setBoot(['myserver', 'ok'])).to.deep.equal(
                buildCommand([ '\\\\myserver', 'boot', 'ok' ]));

        });

    });

});
