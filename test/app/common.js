global.sinon = require('sinon');
global.chai = require('chai');
global.should = require('chai').should();
global.expect = require('chai').expect;
global.AssertionError = require('chai').AssertionError;
global.request = require('supertest');
global.app = require('../../server');
console.log('common.js');
global.swallow = function (thrower) {
    try {
        thrower();
    } catch (e) { }
};

var sinonChai = require('sinon-chai');
global.chai.use(sinonChai);

process.env.NODE_ENV.should.be.equal('test');
