var expect = require('chai').expect,
    cases = require('cases'),
    Q = require('q'),
    coordinator = require('../src/coordinator.js');

describe('coordinator', function() {

    describe('polling a single item', function() {

        var initial, poll1, poll2, poll3, pollPromises;

        beforeEach(function() {
            initial = Q.defer();
            poll1 = Q.defer();
            poll2 = Q.defer();
            poll3 = Q.defer();
            pollPromises = [poll3, poll2, poll1];
        });

        it('should keep polling a until success', function (done) {

            coordinator.poll([initial], 10, 1000, false,
                function(deferred) { return deferred.promise; },
                function(deferred) { 
                    expect(deferred).to.equal(initial);
                    return pollPromises.pop().promise; 
                },
                function(result) { return result; },
                function(item) {})
                .done(function() { 
                    expect(pollPromises).to.be.empty;
                    done();
                });

            initial.resolve();
            poll1.resolve(false);
            poll2.resolve(false);
            poll3.resolve(true);

        });

        it('should fail when timeout is exceeded', function (done) {

            coordinator.poll([ { 
                    initial: initial, 
                    message: 'Some timeout message.' }], 
                10, 500, false,
                function(item) { return item.initial.promise; },
                function() { return pollPromises.pop().promise; },
                function(result) { return result; },
                function(item) { return item.message; })
                .catch(function(error) {
                    expect(pollPromises).to.be.empty;
                    expect(error.message).to.equal('Some timeout message.');
                    done();
                })
                .done();

            initial.resolve();
            poll1.resolve(false);
            poll2.resolve(false);

        });

    });

    describe('polling multiple items', function() {

        var startTime, initial1, poll1, initial2, poll2, initial3, poll3;

        beforeEach(function() {
            startTime = new Date();
            initial1 = Q.defer();
            poll1 = Q.defer();
            initial2 = Q.defer();
            poll2 = Q.defer();
            initial3 = Q.defer();
            poll3 = Q.defer();
        });

        it('should poll in parallel', function (done) {

            var results = [];

            coordinator.poll([ 
                    { initial: initial1, poll: poll1 },
                    { initial: initial2, poll: poll2 },
                    { initial: initial3, poll: poll3 }
                ], 100, 1000, false,
                function(item) { return item.initial.promise; },
                function(item) { return item.poll.promise; },
                function(result) { 
                    results.push(result);
                    return true; 
                },
                function(item) {})
                .done(function() { 
                    expect(results).to.deep.equal([1, 2, 3]);
                    expect(new Date() - startTime).to.below(110);
                    done();
                });

            initial1.resolve();
            initial2.resolve();
            initial3.resolve();
            poll1.resolve(1);
            poll2.resolve(2);
            poll3.resolve(3);

        });

        it('should poll serially', function (done) {

            var results = [];

            coordinator.poll([ 
                    { initial: initial1, poll: poll1 },
                    { initial: initial2, poll: poll2 },
                    { initial: initial3, poll: poll3 }
                ], 100, 1000, true,
                function(item) { return item.initial.promise; },
                function(item) { return item.poll.promise; },
                function(result) { 
                    results.push(result);
                    return true; 
                },
                function(item) {})
                .done(function() { 
                    expect(results).to.deep.equal([1, 2, 3]);
                    expect(new Date() - startTime).to.above(290);
                    done();
                });

            initial1.resolve();
            initial2.resolve();
            initial3.resolve();
            poll1.resolve(1);
            poll2.resolve(2);
            poll3.resolve(3);

        });

    });

});
