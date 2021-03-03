const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const isAuth = require('../../src/middleware/isAuth');


describe('IsAuth Middleware', function () {
    it("should throw an error if no Authorization header is provided", function () {
        const req = {
            get: function () {
                return null;
            }
        };
        const res = {};
        const next = () => { };

        expect(() => isAuth(req, res, next)).to.throw("No Permissions");
    });

    it("should throw an error if no token is provided", function () {
        const req = {
            get: function () {
                return "Bearer"
            }
        };
        const res = {};
        const next = () => { };

        expect(() => isAuth(req, res, next)).to.throw("No Token");
    });

    it("should throw an error if no Bearer keyword is provided", function () {
        const req = {
            get: function () {
                return "token.here"
            }
        };
        const res = {};
        const next = () => { };

        expect(() => isAuth(req, res, next)).to.throw("Wrong API Use");
    });


    it("should throw an error if invalid token is provided", function () {
        const req = {
            get: function () {
                return "Bearer something.invalid.here"
            }
        };
        const res = {};
        const next = () => { };

        expect(() => isAuth(req, res, next)).to.throw();
    });

    it("should set a valid userId property to req object if token is valid", function () {
        const req = {
            get: function () {
                return "Bearer something.valid.here"
            }
        };
        const res = {};
        const next = () => { };

        sinon.stub(jwt, 'verify');
        jwt.verify.returns({ userId: "dummy userId" });

        isAuth(req, res, next);

        expect(req).to.have.property('userId', "dummy userId");
        expect(jwt.verify.called).to.be.true;

        jwt.verify.restore();
    });

    it("should throw an error if the decoded token return a null value", function () {
        const req = {
            get: function () {
                return "Bearer something.valid.here"
            }
        };
        const res = {};
        const next = () => { };

        sinon.stub(jwt, 'verify');
        jwt.verify.returns(null);

        expect(() => isAuth(req, res, next)).to.throw('Empty Token');
        expect(jwt.verify.called).to.be.true;

        jwt.verify.restore();
    });
});