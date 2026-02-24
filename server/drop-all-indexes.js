require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function dropAllIndexes() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const db = mongoose.connection.db;
        const collection = db.collection('candidates');
        const indexes = await collection.indexes();

        console.log('Current Indexes:');
        console.log(indexes.map(i => i.name));

        for (const index of indexes) {
            if (index.name !== '_id_') {
                console.log(`Dropping index: ${index.name}...`);
                await collection.dropIndex(index.name);
                console.log('Done.');
            }
        }

        console.log('All non-primary indexes dropped.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error dropping indexes:', error.message);
        process.exit(1);
    }
}

dropAllIndexes();
