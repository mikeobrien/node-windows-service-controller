var expect = require('chai').expect,
    cases = require('cases'),
    path = require('path'),
    sc = require('../../src/sc');

var binpath = path.join(__dirname, 'service/bin/Service.exe');

describe('module', function() {

    this.timeout(10000);

    describe('control', function() {

        var service1Name = 'service1';
        var service2Name = 'service2';

        before(function(done) {
            sc.create(service1Name, { binpath: binpath + ' ' + service1Name })
                .then(function() { 
                    return sc.create(service2Name, { binpath: binpath + ' ' + service2Name }); 
                })
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        after(function(done) {
            sc.stop(service1Name)
                .then(function() { return sc.delete(service1Name); })
                .then(function() { return sc.stop(service2Name); })
                .then(function() { return sc.delete(service2Name); })
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should start service', function (done) {
            sc.start(service1Name)
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should start service on server', function (done) {
            sc.start('localhost', service1Name)
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should start multiple services', function (done) {
            sc.start([service1Name, service2Name])
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should start multiple services on server', function (done) {
            sc.start('localhost', [service1Name, service2Name])
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should start multiple services serially', function (done) {
            sc.start([service1Name, service2Name], { serial: true })
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should start multiple services serially on server', function (done) {
            sc.start('localhost', [service1Name, service2Name], { serial: true })
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should pause and continue service', function (done) {
            sc.start(service1Name)
                .then(function() { return sc.pause(service1Name); })
                .then(function() { return sc.continue(service1Name); })
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should pause and continue service on server', function (done) {
            sc.start(service1Name)
                .then(function() { return sc.pause('localhost', service1Name); })
                .then(function() { return sc.continue('localhost', service1Name); })
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should pause and continue multiple services', function (done) {
            sc.start([service1Name, service2Name])
                .then(function() { return sc.pause([service1Name, service2Name]); })
                .then(function() { return sc.continue([service1Name, service2Name]); })
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should pause and continue multiple services on server', function (done) {
            sc.start([service1Name, service2Name])
                .then(function() { return sc.pause('localhost', [service1Name, service2Name]); })
                .then(function() { return sc.continue('localhost', [service1Name, service2Name]); })
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should pause and continue multiple services serially', function (done) {
            sc.start([service1Name, service2Name], { serial: true })
                .then(function() { return sc.pause([service1Name, service2Name], { serial: true }); })
                .then(function() { return sc.continue([service1Name, service2Name], { serial: true }); })
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should pause and continue multiple services serially on server', function (done) {
            sc.start([service1Name, service2Name], { serial: true })
                .then(function() { return sc.pause('localhost', [service1Name, service2Name], { serial: true }); })
                .then(function() { return sc.continue('localhost', [service1Name, service2Name], { serial: true }); })
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should stop service', function (done) {
            sc.start(service1Name)
                .then(function() { return sc.stop(service1Name); })
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should stop service on server', function (done) {
            sc.start('localhost', service1Name)
                .then(function() { return sc.stop('localhost', service1Name); })
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should stop multiple services', function (done) {
            sc.start([service1Name, service2Name])
                .then(function() { return sc.stop([service1Name, service2Name]); })
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should stop multiple services on server', function (done) {
            sc.start([service1Name, service2Name])
                .then(function() { return sc.stop('localhost', [service1Name, service2Name]); })
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should stop multiple services serially', function (done) {
            sc.start([service1Name, service2Name], { serial: true })
                .then(function() { return sc.stop([service1Name, service2Name], { serial: true }); })
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should stop service and wait for termination', function (done) {
            sc.start(service1Name)
                .then(function() { return sc.stop(service1Name, { waitForExit: true }); })
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should stop multiple services and wait for termination', function (done) {
            sc.start([service1Name, service2Name], { serial: true })
                .then(function() { return sc.stop([service1Name, service2Name], { waitForExit: true }); })
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should stop multiple services serially and wait for termination', function (done) {
            sc.start([service1Name, service2Name], { serial: true })
                .then(function() { return sc.stop([service1Name, service2Name], { serial: true, waitForExit: true }); })
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should stop multiple services on server and wait for termination on server', function (done) {
            sc.start('localhost', [service1Name, service2Name], { serial: true })
                .then(function() { return sc.stop('localhost', [service1Name, service2Name], { serial: true, waitForExit: true }); })
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

    });

    describe('management', function() {
        
        var serviceName = 'service';
        var serviceDisplayName = 'Some Service';

        before(function(done) {
            sc.create(serviceName, { 
                    binpath: binpath + ' ' + serviceName,
                    displayname: serviceDisplayName
                })
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        after(function(done) {
            sc.delete(serviceName)
                .then(function() { done(); })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should query service', function (done) {
            sc.query({ name: serviceName })
                .then(function(services) { 
                    expect(services).to.have.length(1);
                    var service = services[0];
                    expect(service.name).to.equal(serviceName);
                    expect(service.type.code).to.equal(16);
                    expect(service.type.name).to.equal('WIN32_OWN_PROCESS');
                    expect(service.state.code).to.equal(1);
                    expect(service.state.name).to.equal('STOPPED');
                    expect(service.state.running).to.equal(false);
                    expect(service.state.paused).to.equal(false);
                    expect(service.state.stopped).to.equal(true);
                    expect(service.win32ExitCode).to.equal(1077);
                    expect(service.serviceExitCode).to.equal(0);
                    expect(service.checkpoint).to.equal(0);
                    expect(service.waitHint).to.equal(0);
                    done();
                })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should query config', function (done) {
            sc.getConfig(serviceName)
                .then(function(service) { 
                    expect(service.displayName).to.equal(serviceDisplayName);
                    expect(service.type.code).to.equal(16);
                    expect(service.type.name).to.equal('WIN32_OWN_PROCESS');
                    expect(service.startType.code).to.equal(3);
                    expect(service.startType.name).to.equal('DEMAND_START');
                    expect(service.errorControl.code).to.equal(1);
                    expect(service.errorControl.name).to.equal('NORMAL');
                    expect(service.binPath).to.equal(binpath + ' service');
                    expect(service.loadOrderGroup).to.equal('');
                    expect(service.tag).to.equal(0);
                    done();
                })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should query display name', function (done) {
            sc.getDisplayName(serviceName)
                .then(function(name) { 
                    expect(name).to.equal(serviceDisplayName);
                    done();
                })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should query key name', function (done) {
            sc.getKeyName(serviceDisplayName)
                .then(function(name) { 
                    expect(name).to.equal(serviceName);
                    done();
                })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should set and get description', function (done) {
            sc.setDescription(serviceName, 'oh hai')
                .then(function(name) { return sc.getDescription(serviceName); })
                .then(function(description) { 
                    expect(description).to.equal('oh hai');
                    done();
                })
                .catch(function(error) { done(error); })
                .done();
        });

        it('should query dependencies', function (done) {
            sc.getDependencies('tcpip')
                .then(function(services) { 
                    expect(services).to.have.length.above(0);
                    var service = services[0];
                    expect(service.name).to.equal('WinNat');
                    expect(service.displayName).to.equal('Windows NAT Driver');
                    expect(service.type.code).to.equal(1);
                    expect(service.type.name).to.equal('KERNEL_DRIVER');
                    expect(service.state.code).to.equal(1);
                    expect(service.state.name).to.equal('STOPPED');
                    expect(service.state.running).to.equal(false);
                    expect(service.state.paused).to.equal(false);
                    expect(service.state.stopped).to.equal(true);
                    expect(service.win32ExitCode).to.equal(1077);
                    expect(service.serviceExitCode).to.equal(0);
                    expect(service.checkpoint).to.equal(0);
                    expect(service.waitHint).to.equal(0);
                    console.log(service);
                    done();
                })
                .catch(function(error) { done(error); })
                .done();
        });

    });

});
