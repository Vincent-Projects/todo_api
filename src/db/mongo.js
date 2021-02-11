const mongoose = require('mongoose');

class MongoDB {
    constructor() {
        this.isLocal = true;
        this.collectionName = "default";
        this.update();
    }

    setLocal(isLocal) {
        this.isLocal = isLocal;
    }

    setCollectionName(name) {
        this.collectionName = name;
    }

    setUsername(username) {
        this.username = username;
    }

    setPassword(password) {
        this.password = password;
    }

    setLocalPort(port) {
        this.port = port;
    }

    update() {
        if (this.isLocal) {
            this.uri = `mongodb://localhost:${this.port || 27017}/${this.collectionName}`;
        } else {
            this.uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.xekax.mongodb.net/${collectionName}`;
        }
    }

    async connect() {
        const MONGO_OPTIONS = {
            useNewUrlParser: true,
            useUnifiedTopology: true
        };

        try {
            this.db = await mongoose.connect(this.uri, MONGO_OPTIONS);
        } catch (err) {
            return { err };
        }

        return this.db;
    }

    async destroy() {
        try {
            await mongoose.connection.db.dropCollection(this.collectionName);
            this.isLocal = true;
            this.collectionName = "default";
            this.update();
        } catch (err) {
            return err;
        }

        return null;
    }
}

module.exports = MongoDB;