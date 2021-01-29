const expect = require('chai').expect;
const UserService = require('../src/users/userServices');

describe('Users Service', function () {
    describe('Login user', function () {
        it("When no data is passed, Should return an error object", async function () {
            expect(await UserService.login()).to.have.property('err');
        });

        it('When provided only one argument, Should return an error object', async function () {
            expect(await UserService.login("Sample email")).to.have.property('err');
        });
    });
});
