import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}/`;

    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (!err) {
        this.db = client.db(database);
        console.log('DBClient connected');
      } else {
        console.log(`Connection error: ${err.message}`);
        this.db = false;
      }
    });
  }

  isAlive() {
    return !!this.db;
  }

  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();
export default dbClient;
