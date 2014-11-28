var Q = require('q');

function mapSerial(items, map) {
    var initial = map(items.shift());
    return items.reduce(function(promise, item) {
        return promise.then(function() { return map(item); });
    }, initial);
}

function mapParallel(items, map) {
    return Q.all(items.map(map));
}

function poll(promise, poller, wait, success) {
    return promise
        .delay(wait)
        .then(poller)
        .then(function(result) { 
            if (!success(result)) return poll(promise, poller, wait, success); 
        });
}

exports.poll = function(items, wait, timeout, serial, initial, poller, success, timeoutMessage) {

    var map = function(item) {
        return poll(initial(item), function() { return poller(item); }, 
            wait, success).timeout(timeout, timeoutMessage(item));
    };
    
    return serial ? mapSerial(items, map) : mapParallel(items, map);
};