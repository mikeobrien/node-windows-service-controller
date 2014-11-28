var expect = require('chai').expect,
    cases = require('cases'),
    parse = require('../src/parser.js');

describe('parser', function() {

    describe('parseError', function() {

        var output1 = '\r\n' +
            'ERROR:  The reset and actions options must be set simultaneously\r\n\r\n' +
            'DESCRIPTION:\r\n' +
            '        Changes the actions upon failure\r\n';

        var output2 = '[SC] OpenService FAILED 1060:\r\n\r\n' +
            'The specified service does not exist as an installed service.\r\n\r\n';

        it('should parse errors', cases([
            [ output1, 'The reset and actions options must be set simultaneously' ],
            [ output2, 'The specified service does not exist as an installed service.' ],
            [ 'Some unknown error yo', 'Some unknown error yo' ]
        ], function (output, message) {
            expect(parse.error(output)).to.equal(message);
        }));

    });

    describe('displayName', function() {

        var output = '[SC] GetServiceDisplayName SUCCESS\r\n' +
            'Name = Service\r\n\r\n';

        it('should parse display name', function () {
            expect(parse.displayName(output))
                .to.equal('Service');
        });

    });

    describe('keyName', function() {

        var output = '[SC] GetServiceKeyName SUCCESS\r\n' +
            'Name = Service\r\n\r\n';

        it('should parse key name', function () {
            expect(parse.keyName(output))
                .to.equal('Service');
        });

    });

    describe('description', function() {

        var output = '[SC] QueryServiceConfig2 SUCCESS\r\n\r\n' +
            'SERVICE_NAME: Service\r\n' +
            'DESCRIPTION:  oh hai\r\n\r\n';

        it('should parse description', function () {
            expect(parse.description(output))
                .to.equal('oh hai');
        });

    });

    describe('descriptor', function() {

        var output = '\r\nD:(A;;CCLCSWLOCRRC;;;AU)' + 
            '(A;;CCLCSWRPWPDTLOCRRC;;;NO)(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;BA)' + 
            '(A;;CCLCSWRPLOCRRC;;;S-1-2-1)(A;;CCLCSWRPWPDTLOCRRC;;;SY)S:' + 
            '(AU;FA;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;WD)\r\n';

        var descriptor = 'D:(A;;CCLCSWLOCRRC;;;AU)' + 
            '(A;;CCLCSWRPWPDTLOCRRC;;;NO)(A;;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;BA)' + 
            '(A;;CCLCSWRPLOCRRC;;;S-1-2-1)(A;;CCLCSWRPWPDTLOCRRC;;;SY)S:' + 
            '(AU;FA;CCDCLCSWRPWPDTLOCRSDRCWDWO;;;WD)';

        it('should parse descriptor', function () {
            expect(parse.descriptor(output))
                .to.equal(descriptor);
        });

    });

    describe('lock', function() {

        var output = '[SC] QueryServiceLockStatus SUCCESS\r\n' +
            '        IsLocked      : TRUE\r\n' +
            '        LockOwner     : .\\NT Service Control Manager\r\n' +
            '        LockDuration  : 1090 (seconds since acquired)\r\n\r\n';

        it('should parse lock', function () {
            expect(parse.lock(output))
                .to.deep.equal({
                    locked: true,
                    owner: '.\\NT Service Control Manager',
                    duration: 1090
                });
        });

    });

    describe('failureConfig', function() {

        var output = '[SC] QueryServiceConfig2 SUCCESS\r\n\r\n' +
            'SERVICE_NAME: Service\r\n' +
            '        RESET_PERIOD (in seconds)    : 30\r\n' +
            '        REBOOT_MESSAGE               : oh hai\r\n' +
            '        COMMAND_LINE                 : C:\\Temp\\command.exe\r\n' +
            '        FAILURE_ACTIONS              : RUN PROCESS -- Delay = 10000 milliseconds.\r\n\r\n';

        it('should parse failure config', function () {
            expect(parse.failureConfig(output))
                .to.deep.equal({
                    resetPeriod: 30,
                    rebootMessage: 'oh hai',
                    commandLine: 'C:\\Temp\\command.exe',
                    failureActions: 'RUN PROCESS -- Delay = 10000 milliseconds.'
                });
        });

    });

    describe('config', function() {

        var output = '[SC] QueryServiceConfig SUCCESS\r\n\r\n' +
            'SERVICE_NAME: Service\r\n' +
            '        TYPE               : 10  WIN32_OWN_PROCESS\r\n' +
            '        START_TYPE         : 3   DEMAND_START\r\n' +
            '        ERROR_CONTROL      : 1   NORMAL\r\n' +
            '        BINARY_PATH_NAME   : C:\\Temp\\service.exe\r\n' +
            '        LOAD_ORDER_GROUP   : LoadOrderGroup\r\n' +
            '        TAG                : 0\r\n' +
            '        DISPLAY_NAME       : Service\r\n' +
            '        DEPENDENCIES       : NSI\r\n' +
            '                           : Tdx\r\n' +
            '                           : Afd\r\n' +
            '        SERVICE_START_NAME : NT Authority\\LocalService\r\n';

        it('should parse failure config', function () {
            expect(parse.config(output))
                .to.deep.equal({
                    type: { code: 16, name: 'WIN32_OWN_PROCESS' },
                    startType: { code: 3, name: 'DEMAND_START' },
                    errorControl: { code: 1, name: 'NORMAL' },
                    binPath: 'C:\\Temp\\service.exe',
                    loadOrderGroup: 'LoadOrderGroup',
                    tag: 0,
                    displayName: 'Service',
                    dependencies: ['NSI', 'Tdx', 'Afd'],
                    serviceStartName: 'NT Authority\\LocalService'
                });
        });

    });

    describe('services', function() {

        var output1 = '\r\n' +
            'SERVICE_NAME: AdobeARMservice\r\n' +
            'DISPLAY_NAME: Adobe Acrobat Update Service\r\n' +
            '        TYPE               : 10  WIN32_OWN_PROCESS  \r\n' +
            '        STATE              : 4  RUNNING \r\n' +
            '                                (STOPPABLE, NOT_PAUSABLE, IGNORES_SHUTDOWN)\r\n' +
            '        WIN32_EXIT_CODE    : 1  (0x0)\r\n' +
            '        SERVICE_EXIT_CODE  : 2  (0x0)\r\n' +
            '        CHECKPOINT         : 0x2A\r\n' +
            '        WAIT_HINT          : 0x4\r\n' +
            '        PID                : 1100\r\n' +
            '        FLAGS              : \r\n\r\n' +

            'SERVICE_NAME: AppHostSvc\r\n' +
            'DISPLAY_NAME: Application Host Helper Service\r\n' +
            '        TYPE               : 20  WIN32_OWN_PROCESS \r\n' + 
            '        STATE              : 4  RUNNING \r\n' +
            '                                (STOPPABLE, PAUSABLE, ACCEPTS_SHUTDOWN)\r\n' +
            '        WIN32_EXIT_CODE    : 5  (0x0)\r\n' +
            '        SERVICE_EXIT_CODE  : 6  (0x0)\r\n' +
            '        CHECKPOINT         : 0x7\r\n' +
            '        WAIT_HINT          : 0x8\r\n' +
            '        PID                : 1116\r\n' +
            '        FLAGS              : RUNS_IN_SYSTEM_PROCESS\r\n';

        var output2 = '[SC] EnumDependentServices: entriesread = 5\r\n\r\n' +

            'SERVICE_NAME: NcaSvc\r\n' +
            'DISPLAY_NAME: Network Connectivity Assistant\r\n' +
            '        TYPE               : 20  WIN32_SHARE_PROCESS\r\n' +  
            '        STATE              : 1  STOPPED \r\n' +
            '        WIN32_EXIT_CODE    : 2  (0x0)\r\n' +
            '        SERVICE_EXIT_CODE  : 3  (0x0)\r\n' +
            '        CHECKPOINT         : 0x1A\r\n' +
            '        WAIT_HINT          : 0x5\r\n\r\n' +

            'SERVICE_NAME: iphlpsvc\r\n' +
            'DISPLAY_NAME: IP Helper\r\n' +
            '        TYPE               : 20  WIN32_SHARE_PROCESS\r\n' +  
            '        STATE              : 4  RUNNING \r\n' +
            '                                (STOPPABLE, NOT_PAUSABLE, IGNORES_SHUTDOWN)\r\n' +
            '        WIN32_EXIT_CODE    : 6  (0x0)\r\n' +
            '        SERVICE_EXIT_CODE  : 7  (0x0)\r\n' +
            '        CHECKPOINT         : 0x8\r\n' +
            '        WAIT_HINT          : 0x9\r\n';

        var services1 = [ 
            {
                name: 'AdobeARMservice',
                displayName: 'Adobe Acrobat Update Service',
                type: { code: 16, name: 'WIN32_OWN_PROCESS' },
                state: { 
                    code: 4, 
                    name: 'RUNNING',
                    running: true,
                    paused: false,
                    stopped: false
                },
                accepted: ['STOPPABLE', 'NOT_PAUSABLE', 'IGNORES_SHUTDOWN'],
                win32ExitCode: 1,
                serviceExitCode: 2,
                checkpoint: 42,
                waitHint: 4,
                pid: 1100
            },
            {
                name: 'AppHostSvc',
                displayName: 'Application Host Helper Service',
                type: { code: 32, name: 'WIN32_OWN_PROCESS' },
                state: { 
                    code: 4, 
                    name: 'RUNNING',
                    running: true,
                    paused: false,
                    stopped: false
                },
                accepted: ['STOPPABLE', 'PAUSABLE', 'ACCEPTS_SHUTDOWN'],
                win32ExitCode: 5,
                serviceExitCode: 6,
                checkpoint: 7,
                waitHint: 8,
                pid: 1116,
                flags: 'RUNS_IN_SYSTEM_PROCESS'
            }
        ];

        var services2 = [ 
            {
                name: 'NcaSvc',
                displayName: 'Network Connectivity Assistant',
                type: { code: 32, name: 'WIN32_SHARE_PROCESS' },
                state: { 
                    code: 1, 
                    name: 'STOPPED',
                    running: false,
                    paused: false,
                    stopped: true
                },
                win32ExitCode: 2,
                serviceExitCode: 3,
                checkpoint: 26,
                waitHint: 5
            },
            {
                name: 'iphlpsvc',
                displayName: 'IP Helper',
                type: { code: 32, name: 'WIN32_SHARE_PROCESS' },
                state: { 
                    code: 4, 
                    name: 'RUNNING',
                    running: true,
                    paused: false,
                    stopped: false
                },
                accepted: ['STOPPABLE', 'NOT_PAUSABLE', 'IGNORES_SHUTDOWN'],
                win32ExitCode: 6,
                serviceExitCode: 7,
                checkpoint: 8,
                waitHint: 9
            }
        ];

        it('should parse errors', cases([
            [ output1, services1 ],
            [ output2, services2 ]
        ], function (output, services) {
            expect(parse.services(output)).to.deep.equal(services);
        }));

    });

});
