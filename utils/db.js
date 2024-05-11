import { MongoClient } from 'mongodb';

class DBClient {
    constructor() {
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'files_manager';

        const url = `mongodb://${host}:${port}`;

        this.client = new MongoClient(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        this.db = null; // Will be initialized after connecting to the database

        this.client.connect()
            .then(() => {
                console.log('Connected to MongoDB');
                this.db = this.client.db(database);
            })
            .catch((error) => {
                console.error('Error connecting to MongoDB:', error);
            });
    }

    isAlive() {
        return this.client.isConnected();
    }

    async nbUsers() {
        if (!this.isAlive()) {
            throw new Error('DB connection is not alive');
        }

        const usersCollection = this.db.collection('users');
        return await usersCollection.countDocuments();
    }

    async nbFiles() {
        if (!this.isAlive()) {
            throw new Error('DB connection is not alive');
        }

        const filesCollection = this.db.collection('files');
        return await filesCollection.countDocuments();
    }
}

const dbClient = new DBClient();
export default dbClient;
