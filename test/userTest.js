const expect = require('chai').expect;
const UserService = require('../src/users/userServices');
const DBFactory = require('../src/db').DBFactory;

describe('Users Service', function () {
    describe('Login user', function () {
        it("When no data is passed, Should return an error object", async function () {
            expect(await UserService.login()).to.have.property('err');
        });

        it('When provided only one argument, Should return an error object', async function () {
            expect(await UserService.login("Sample email")).to.have.property('err');
        });

        beforeEach(() => {
            const mongoInstance = DBFactory
                .createDB("MONGO")
            mongoInstance.setCollectionName("Todos")
            mongoInstance.update();

            mongoInstance.connect();

        });

        it("When user data are new, user should be created", async function () {
            mongoInstance.find().then(result => console.log('test')).catch(err => console.log('err'))
        });

        afterEach(() => {
            mongoInstance.destroy();
        });
    });
});
