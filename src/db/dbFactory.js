const MongoDB = require('./mongo');
const PostgresDB = require('./postgres');

class DBFactory {
    static createDB(type) {
        switch (type) {
            case "MONGO":
                return new MongoDB();
            case "POSTGRES":
                return new PostgresDB();
            default:
                return null;
        }
    }
}

module.exports = DBFactory;