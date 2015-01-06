var expect = require('chai').expect,
    cases = require('cases'),
    parse = require('../../src/tasklist-parser');

describe('parser', function() {

    it('should parse processes', cases([
        [ 'INFO: No tasks are running which match the specified criteria.', [] ],
        [ '"service.exe","1234","Services","0","11,984 K"', 
          [ { name: 'service.exe', pid: 1234, sessionName: 'Services', session: 0, memory: '11,984 K' } ] ],
        [ '"service1.exe","1234","Services","0","12,345 K"\r\n' +
          '"service2.exe","5678","Services","1","6,789 K"', [
          { name: 'service1.exe', pid: 1234, sessionName: 'Services', session: 0, memory: '12,345 K' },
          { name: 'service2.exe', pid: 5678, sessionName: 'Services', session: 1, memory: '6,789 K' } ] ]
    ], function (output, processes) {
        expect(parse(output)).to.deep.equal(processes);
    }));

});
