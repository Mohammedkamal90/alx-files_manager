import { MongoClient } from 'mongodb';

class DBClient {
    constructor() {
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'files_manager';

        this.client = new MongoClient(`mongodb://${host}:${port}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        this.client.connect((err) => {
            if (err) {
                console.error(`DB connection error: ${err}`);
            } else {
                console.log('DB connected successfully');
            }
        });
    }

    isAlive() {
        return !!this.client && !!this.client.topology && this.client.topology.isConnected();
    }

    async nbUsers() {
        if (!this.isAlive()) {
            throw new Error('DB connection is not alive');
        }

        const usersCollection = this.client.db().collection('users');
        return await usersCollection.countDocuments();
    }

    async nbFiles() {
        if (!this.isAlive()) {
            throw new Error('DB connection is not alive');
        }

        const filesCollection = this.client.db().collection('files');
        return await filesCollection.countDocuments();
    }
}

const dbClient = new DBClient();

const waitConnection = () => {
    return new Promise((resolve, reject) => {
        let i = 0;
        const repeatFct = async () => {
            await setTimeout(() => {
                i += 1;
                if (i >= 10) {
                    reject(new Error('Database connection timeout'));
                }
                else if (!dbClient.isAlive()) {
                    repeatFct()
                }
                else {
                    resolve()
                }
            }, 1000);
        };
        repeatFct();
    })
};

(async () => {
    console.log(dbClient.isAlive());
    try {
        await waitConnection();
        console.log(dbClient.isAlive());
        console.log(await dbClient.nbUsers());
        console.log(await dbClient.nbFiles());
    } catch (error) {
        if (error && error.message) {
            console.error('Error:', error.message);
        } else {
            console.error('Error:', error);
        }
    }
})();

export default dbClient;
