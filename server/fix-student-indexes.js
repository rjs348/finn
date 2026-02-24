require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function fixStudentIndexes() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const db = mongoose.connection.db;
        const collection = db.collection('students');
        const indexes = await collection.indexes();

        console.log('Current Indexes in "students":');
        console.log(JSON.stringify(indexes, null, 2));

        for (const index of indexes) {
            if (index.name.includes('rollNo')) {
                console.log(`Dropping index: ${index.name}...`);
                await collection.dropIndex(index.name);
                console.log('Done.');
            }
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

fixStudentIndexes();
