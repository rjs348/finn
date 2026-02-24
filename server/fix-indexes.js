require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function checkIndexes() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const db = mongoose.connection.db;
        const collection = db.collection('candidates');
        const indexes = await collection.indexes();

        console.log('Current Indexes:');
        console.log(JSON.stringify(indexes, null, 2));

        const hasRollNumberIndex = indexes.some(idx => idx.key.rollNumber);
        if (hasRollNumberIndex) {
            console.log('Found unique index on rollNumber. Dropping it...');
            await collection.dropIndex('rollNumber_1');
            console.log('Index dropped successfully.');
        } else {
            console.log('No rollNumber index found.');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkIndexes();
