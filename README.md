# windows-service-controller

[![npm version](http://img.shields.io/npm/v/windows-service-controller.svg?style=flat)](https://npmjs.org/package/windows-service-controller) [![build status](http://img.shields.io/travis/mikeobrien/node-windows-service-controller.svg?style=flat)](https://travis-ci.org/mikeobrien/node-windows-service-controller) [![Dependency Status](http://img.shields.io/david/mikeobrien/node-windows-service-controller.svg?style=flat)](https://david-dm.org/mikeobrien/node-windows-service-controller) [![npm downloads](http://img.shields.io/npm/dm/windows-service-controller.svg?style=flat)](https://npmjs.org/package/windows-service-controller)

Windows service controller for node. Wraps [sc](http://technet.microsoft.com/en-us/library/bb490995.aspx).

## Install

```bash
$ npm install windows-service-controller --save
```

## Usage

All commands return a promise. Information returned by the `sc` command, if any, will be parsed and passed when the promise is resolved. The error message from `sc` is also parsed and passed when the promise is rejected. Unless otherwise indicated, the promise is resolved when `sc` exits.

```js
var sc = require('windows-service-controller');

sc.getDisplayName('SomeService')
    .catch(function(error) { 
        console.log(error.message);
    })
    .done(function(displayName) { 
        console.log('Display name: ' + displayName); 
    });
```

The server name is optional for all commands. Omitting it will target the local machine. You do not need to specify the UNC path prefix as this is added automatically when a server name is passed. Either of the following are valid:

```js
sc.start('MyService');

sc.start('MyServer', 'MyService');
```

## Commands

All `sc` commands are fully supported by this module.

- [Control Commands](#control-commands)
  - [Timeout](#timeout)
  - [Start](#start)
  - [Pause](#pause)
  - [Continue](#continue)
  - [Stop](#stop)
  - [Control](#control)
  - [Interrogate](#interrogate)
- [Management Commands](#management-commands)
  - [Create](#create)
  - [Get Display Name](#get-display-name)
  - [Get Key Name](#get-key-name)
  - [Get Description](#get-description)
  - [Set Description](#set-description)
  - [Get Dependencies](#get-dependencies)
  - [Get Security Descriptor](#get-security-descriptor)
  - [Set Security Descriptor](#set-security-descriptor)
  - [Get Configuration](#get-configuration)
  - [Set Configuration](#set-configuration)
  - [Get Failure Configuration](#get-failure-configuration)
  - [Set Failure Configuration](#set-failure-configuration)
  - [Query](#query)
  - [Delete](#delete)
- [System Commands](#system-commands)
  - [Set Boot](#set-boot)
  - [Lock](#lock)
  - [Get Lock](#get-lock)

## Control Commands

Unlike the rest of the commands, `start`, `pause`, `continue` and `stop` do not resolve until the service state has changed or the timeout has been reached.

### Timeout

Sets the timeout for control commands. Default is 30 seconds.

```js
sc.timeout(120);
```

### Start

Starts a service or services. Resolves the promise when the *all* the services specified are running or rejects it if it timed out. *Server name and service arguments are optional.*

```js
sc.start('ServerName', 'ServiceName', {
        args: ['ServiceArg1', 'ServiceArg2']
    });


sc.start('ServerName', ['ServiceName1', 'ServiceName2'], {
        args: ['ServiceArg1', 'ServiceArg2']
    });
```

### Pause

Sends a PAUSE control request to a service or services. Resolves the promise when *all* the services specified are paused or rejects it if it timed out. *Server name is optional.*

```js
sc.pause('ServerName', 'ServiceName');

sc.pause('ServerName', ['ServiceName1', 'ServiceName2']);
```

### Continue

Sends a CONTINUE control request to a service or services in order to resume a paused service. Resolves the promise when *all* the services specified are running or rejects it if it timed out. *Server name is optional.*

```js
sc.continue('ServerName', 'ServiceName');

sc.continue('ServerName', ['ServiceName1', 'ServiceName2']);
```

### Stop

Sends a STOP control request to a service or services. Resolves the promise when *all* the services specified are stopped or rejects it if it timed out. *Server name is optional.*

```js
sc.stop('ServerName', 'ServiceName');

sc.stop('ServerName', ['ServiceName1', 'ServiceName2']);
```

### Control

Sends a CONTROL B to a service. *Server name is optional.*

```js
sc.control('ServerName', 'ServiceName', 
    'paramchange|netbindadd|netbindremove|netbindenable|netbinddisable|UserDefinedControlB');
```

### Interrogate

Sends an INTERROGATE control request to a service. *Server name is optional.*

```js
sc.interrogate('ServerName', 'ServiceName');
```

## Management Commands

### Create

Creates a subkey and entries for the service in the registry and in the Service Control Manager's database. *Server name is optional.*

```js
sc.create('ServerName', 'ServiceName', {

    // Specifies the service type. interact must be used in conjunction with interact option.
    type: 'own|share|kernel|filesys|rec|adapt|interact', 

    // Specifies interaction type. Must be used in conjunction with a type of interact.
    interact: 'own|share', 

    // Specifies the start type for the service. The default start is demand.
    start: 'boot|system|auto|demand|disabled',

    // Specifies the severity of the error if the service fails to start during boot.
    // The default is normal.
    error: 'normal|severe|critical|ignore',

    // Specifies a path to the service binary file. There is no default for binpath 
    // and this string must be supplied.
    binpath: 'path/to/service',

    // Specifies the name of the group of which this service is a member. 
    // The list of groups is stored in the registry in the 
    // HKLM\System\CurrentControlSet\Control\ServiceGroupOrder subkey. 
    // The default is null.
    group: 'LoadOrderGroup',

    // Specifies whether or not to obtain a TagID from the CreateService call. 
    // Tags are only used for boot-start and system-start drivers.
    tag: true|false,

    // Specifies the names of services or groups which must start before 
    // this service.
    depend: [ 'Dependency1', 'Dependency2' ],

    // Specifies a name of an account in which a service will run, or 
    // specifies a name of the Windows driver object in which the driver 
    // will run. The default is LocalSystem.
    obj: 'AccountName/ObjectName',

    // Specifies a friendly, meaningful name that can be used in user-interface 
    // programs to identify the service to users. For example, the subkey name 
    // of one service is wuauserv, which is not be helpful to the user, and the 
    // display name is Automatic Updates.
    displayname: 'DisplayName',

    // Specifies a password. This is required if an account other 
    // than the LocalSystem account is used.
    password: 'Password'
});
```

### Get Display Name

Gets the display name associated with a particular service. *Server name is optional.*

```js
sc.getDisplayName('ServerName', 'ServiceName')
    .done(function(displayName) { 
        console.log('Display name: ' + displayName); 
    });
```

### Get Key Name

Gets the key name associated with a particular service, using the display name as input. *Server name is optional.*

```js
sc.getKeyName('ServerName', 'ServiceName')
    .done(function(keyName) { 
        console.log('Key name: ' + keyName); 
    });
```

### Get Description

Gets the description string of a service. *Server name is optional.*

```js
sc.getDescription('ServerName', 'ServiceName')
    .done(function(description) { 
        console.log('Description: ' + description); 
    });
```

### Set Description

Sets the description string for a service. *Server name is optional.*

```js
sc.setDescription('ServerName', 'ServiceName', 'Description');
```

### Get Dependencies

Enumerates the services that cannot run unless the specified service is running. *Server name is optional.*

```js
sc.getDependencies('ServerName', 'ServiceName')
    .done(function(dependencies) { 
        console.log('Total dependencies: ' + dependencies.length); 
    });
```

An array of dependencies is passed when the promise is resolved. For more information about this data structure see [here](http://msdn.microsoft.com/en-us/library/windows/desktop/ms685996%28v=vs.85%29.aspx).

```js
[ 
    {
        // The name of the service.
        name: 'iphlpsvc',

        // The display name of the service.
        displayName: 'IP Helper',

        // The type of service. This member can be one of the following values.
        // KERNEL_DRIVER = 1
        // FILE_SYSTEM_DRIVER = 2
        // WIN32_OWN_PROCESS = 16
        // WIN32_SHARE_PROCESS = 32
        // WIN32_OWN_PROCESS + INTERACTIVE_PROCESS = 272
        // WIN32_SHARE_PROCESS + INTERACTIVE_PROCESS = 288
        type: { 
            code: 20, 
            name: 'WIN32_SHARE_PROCESS' 
        },

        // The current state of the service. This member can be one of the following values.
        // STOPPED = 1
        // START_PENDING = 2
        // STOP_PENDING = 3
        // RUNNING = 4
        // CONTINUE_PENDING = 5
        // PAUSE_PENDING = 6
        // PAUSED = 7
        state: { 
            code: 4, 
            name: 'RUNNING',
            running: true,
            paused: false,
            stopped: false
        },

        // The control codes the service accepts and processes in its handler function.
        // See the documentation linked to above for additional flags.
        // ACCEPT_STOP = 1
        // ACCEPT_PAUSE_CONTINUE = 2
        // ACCEPT_SHUTDOWN = 4
        // ACCEPT_PARAMCHANGE = 8
        // ACCEPT_NETBINDCHANGE = 16
        // ACCEPT_PRESHUTDOWN = 256
        accepted: ['STOPPABLE', 'NOT_PAUSABLE', 'IGNORES_SHUTDOWN'],

        // The error code that the service uses to report an error that 
        // occurs when it is starting or stopping. 
        win32ExitCode: 0,

        // The service-specific error code that the service returns when an error occurs 
        // while the service is starting or stopping.
        serviceExitCode: 0,

        // The check-point value that the service increments periodically to report its 
        // progress during a lengthy start, stop, pause, or continue operation.
        checkpoint: 0,

        // The estimated time required for a pending start, stop, pause, or 
        // continue operation, in milliseconds. 
        waitHint: 0,
    },
    ...
]
```

### Get Security Descriptor

Gets a service's security descriptor using SDDL. *Server name is optional.*

```js
sc.getDescriptor('ServerName', 'ServiceName')
    .done(function(descriptor) { 
        console.log('Descriptor: ' + descriptor); 
    });
```

### Set Security Descriptor

Sets a service's security descriptor using Service Descriptor Definition Language (SDDL). *Server name is optional.*

```js
sc.setDescriptor('ServerName', 'ServiceName', 'ServiceSecurityDescriptor');
```

### Get Configuration

Gets the configuration information for a service. *Server name is optional.*

```js
sc.getConfig('ServerName', 'ServiceName')
    .done(function(config) { 
        console.log('Service type: ' + config.type.name); 
    });
```

The service configuration is passed when the promise is resolved. For more information about this data structure see [here](http://msdn.microsoft.com/en-us/library/windows/desktop/ms684950(v=vs.85).aspx).

```js
{
    // The display name to be used by service control programs to identify the service.
    displayName: 'Service',

    // Names of services or load ordering groups that must start before this service.
    dependencies: ['NSI', 'Tdx', 'Afd'],

    // If the service type is SERVICE_WIN32_OWN_PROCESS or SERVICE_WIN32_SHARE_PROCESS, 
    // this member is the name of the account that the service process will be logged 
    // on as when it runs. 
    // If the service type is SERVICE_KERNEL_DRIVER or SERVICE_FILE_SYSTEM_DRIVER, this 
    // member is the driver object name (that is, \FileSystem\Rdr or \Driver\Xns) which 
    // the input and output (I/O) system uses to load the device driver.
    serviceStartName: 'NT Authority\\LocalService',

    // The type of service. This member can be one of the following values.
    // KERNEL_DRIVER = 1
    // FILE_SYSTEM_DRIVER = 2
    // WIN32_OWN_PROCESS = 16
    // WIN32_SHARE_PROCESS = 32
    // WIN32_OWN_PROCESS + INTERACTIVE_PROCESS = 272
    // WIN32_SHARE_PROCESS + INTERACTIVE_PROCESS = 288
    type: { 
        code: 10, 
        name: 'WIN32_OWN_PROCESS' 
    },

    // When to start the service. This member can be one of the following values.
    // BOOT_START = 0
    // SYSTEM_START = 1
    // AUTO_START = 2
    // DEMAND_START = 3
    // DISABLED = 4
    startType: { 
        code: 3, 
        name: 'DEMAND_START' 
    },

    // The severity of the error, and action taken, if this service fails 
    // to start. This member can be one of the following values.
    // IGNORE = 0
    // NORMAL = 1
    // SEVERE = 2
    // CRITICAL = 3
    errorControl: { 
        code: 1, 
        name: 'NORMAL' 
    },

    // The fully qualified path to the service binary file.
    binPath: 'C:\\Services\\service.exe',

    // The name of the load ordering group to which this service belongs. 
    // If the member is NULL or an empty string, the service does not belong 
    // to a load ordering group.
    loadOrderGroup: 'NetDDEGroup',

    // A unique tag value for this service in the group specified by the 
    // loadOrderGroup parameter.
    tag: 0
}
```

### Set Configuration

Modifies the value of a service's entries in the registry and in the Service Control Manager's database. *Server name is optional.*

```js
sc.setConfig('ServerName', 'ServiceName', {

    // Specifies the service type. interact must be used in conjunction with interact option.
    type: 'own|share|kernel|filesys|rec|adapt|interact', 

    // Specifies interaction type. Must be used in conjunction with a type of interact.
    interact: 'own|share', 

    // Specifies the start type for the service.
    start: 'boot|system|auto|demand|disabled',

    // Specifies the severity of the error if the service fails to start during boot.
    error: 'normal|severe|critical|ignore',

    // Specifies a path to the service binary file.
    binpath: 'path/to/service',

    // Specifies the name of the group of which this service is a member. 
    // The list of groups is stored in the registry in the 
    // HKLM\System\CurrentControlSet\Control\ServiceGroupOrder subkey. 
    // The default is null.
    group: 'LoadOrderGroup',

    // Specifies whether or not to obtain a TagID from the CreateService call. 
    // Tags are only used for boot-start and system-start drivers.
    tag: true|false,

    // Specifies the names of services or groups which must start before 
    // this service.
    depend: [ 'Dependency1', 'Dependency2' ],

    // Specifies a name of an account in which a service will run, or 
    // specifies a name of the Windows driver object in which the driver 
    // will run. The default is LocalSystem.
    obj: 'AccountName/ObjectName',

    // Specifies a friendly, meaningful name that can be used in user-interface 
    // programs to identify the service to users. For example, the subkey name 
    // of one service is wuauserv, which is not be helpful to the user, and the 
    // display name is Automatic Updates.
    displayname: 'DisplayName',

    // Specifies a password. This is required if an account other 
    // than the LocalSystem account is used.
    password: 'Password'
});
```

### Get Failure Configuration

Gets the actions that will be performed if the specified service fails. *Server name is optional.*

```js
sc.getFailureConfig('ServerName', 'ServiceName')
    .done(function(config) { 
        console.log('Reset period: ' + config.resetPeriod); 
    });
```

The service failure configuration is passed when the promise is resolved. For more information about this data structure see [here](http://msdn.microsoft.com/en-us/library/windows/desktop/ms685939(v=vs.85).aspx).

```js
{
    // The time after which to reset the failure count to zero if 
    // there are no failures, in seconds.
    resetPeriod: 30,

    // The message to be broadcast to server users before rebooting in response 
    // to the SC_ACTION_REBOOT service controller action.
    rebootMessage: 'An error has occured.',

    // The command line of the process for the CreateProcess function to execute 
    // in response to the SC_ACTION_RUN_COMMAND service controller action. This 
    // process runs under the same account as the service.
    commandLine: 'C:\\Services\\error.exe',

    // Represents an action that the service control manager can perform.
    failureActions: 'RUN PROCESS -- Delay = 10000 milliseconds.'
}
```

### Set Failure Configuration

Specifies what action to take upon failure of the service. *Server name is optional.*

```js
sc.setFailureConfig('ServerName', 'ServiceName', {
    
    // Specifies the length of the period (in seconds) with no failures 
    // after which the failure count should be reset to 0. This parameter 
    // must be used in conjunction with the actions= parameter.
    reset: 30, 
    
    // Specifies the message to be broadcast upon failure of the service.
    reboot: 'Broadcast message',  
    
    // Specifies the command line to be run upon failure of the service. For more 
    // information about how to run a batch or VBS file upon failure, see Remarks.
    command: 'path/to/failure.exe',
    
    // Specifies the failure actions and their delay time (in milliseconds). 
    // The following actions are valid: run, restart, and reboot. This parameter 
    // must be used in conjunction with the reset parameter. Omit this option 
    // to take no action upon failure.
    actions: {
        restart: 5000,
        run: 10000,
        reboot: 60000
    }

});
```

### Query

Enumerates services. *Server name is optional.*

```js
sc.query('ServerName', {
    
    // Specifies a service to query.
    name: 'ServiceName', 

    // Specifies what to enumerate and the type. The default type is service.
    class: 'driver|service|all'.

    // Specifies the type of services or type of drivers to enumerate.
    type: 'own|share|interact|kernel|filesys|rec|adapt'.

    // Specifies the started state of the service for which to enumerate. 
    // The default state is active.
    state: 'active|inactive|all',

    // Specifies the service group to enumerate. The default is all groups.
    group: 'GroupName'

}).done(function(services) { 
        console.log('Total services: ' + services.length); 
    });
```

An array of services is passed when the promise is resolved. For more information about this data structure see [here](http://msdn.microsoft.com/en-us/library/windows/desktop/ms685992(v=vs.85).aspx).

```js
[ 
    {
        // The name of the service.
        name: 'iphlpsvc',

        // The display name of the service.
        displayName: 'IP Helper',

        // The type of service. This member can be one of the following values.
        // KERNEL_DRIVER = 1
        // FILE_SYSTEM_DRIVER = 2
        // WIN32_OWN_PROCESS = 16
        // WIN32_SHARE_PROCESS = 32
        // WIN32_OWN_PROCESS + INTERACTIVE_PROCESS = 272
        // WIN32_SHARE_PROCESS + INTERACTIVE_PROCESS = 288
        type: { 
            code: 20, 
            name: 'WIN32_SHARE_PROCESS' 
        },

        // The current state of the service. This member can be one of the following values.
        // STOPPED = 1
        // START_PENDING = 2
        // STOP_PENDING = 3
        // RUNNING = 4
        // CONTINUE_PENDING = 5
        // PAUSE_PENDING = 6
        // PAUSED = 7
        state: { 
            code: 4, 
            name: 'RUNNING',
            running: true,
            paused: false,
            stopped: false
        },

        // The control codes the service accepts and processes in its handler function.
        // See the documentation linked to above for additional flags.
        // ACCEPT_STOP = 1
        // ACCEPT_PAUSE_CONTINUE = 2
        // ACCEPT_SHUTDOWN = 4
        // ACCEPT_PARAMCHANGE = 8
        // ACCEPT_NETBINDCHANGE = 16
        // ACCEPT_PRESHUTDOWN = 256
        accepted: ['STOPPABLE', 'NOT_PAUSABLE', 'IGNORES_SHUTDOWN'],

        // The error code that the service uses to report an error that 
        // occurs when it is starting or stopping. 
        win32ExitCode: 0,

        // The service-specific error code that the service returns when an error occurs 
        // while the service is starting or stopping.
        serviceExitCode: 0,

        // The check-point value that the service increments periodically to report its 
        // progress during a lengthy start, stop, pause, or continue operation.
        checkpoint: 0,

        // The estimated time required for a pending start, stop, pause, or 
        // continue operation, in milliseconds. 
        waitHint: 0,

        // The process identifier of the service.
        pid: 1116,

        // If SERVICE_RUNS_IN_SYSTEM_PROCESS, the service runs in a system 
        // process that must always be running.
        flags: 'RUNS_IN_SYSTEM_PROCESS'
    },
    ...
]
```

### Delete

Deletes a service subkey from the registry. If the service is running or if another process has an open handle to the service, then the service is marked for deletion. *Server name is optional.*

```js
sc.delete('ServerName', 'ServiceName');
```

## System Commands

### Set Boot

Specifies whether the last boot was bad or whether it should be saved as the last-known-good boot configuration. *Server name is optional.*

```js
sc.setBoot('ServerName', 'ok|bad');
```

### Lock

Locks the Service Control Manager's database. *Server name is optional.*

```js
sc.lock('ServerName');
```

### Get Lock

Gets the lock status for the Service Control Manager's database. *Server name is optional.*

```js
sc.getLock('ServerName')
    .done(function(lock) { 
        console.log('Locked: ' + lock.locked); 
    });
```

Lock information is passed when the promise is resolved. For more information about this data structure see [here](http://msdn.microsoft.com/en-us/library/windows/desktop/ms684953(v=vs.85).aspx).

```js
{
    // The lock status of the database.
    locked: true,

    // The name of the user who acquired the lock.
    owner: '.\\NT Service Control Manager',

    // The time since the lock was first acquired, in seconds.
    duration: 1090
}
```

## License
MIT License
