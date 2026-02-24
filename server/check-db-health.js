require('dotenv').config({ path: 'server/.env' });
const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function checkHealth() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('✅ Connected.');

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log('Collections:');
        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(` - ${col.name}: ${count}`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        process.exit(1);
    }
}

checkHealth();
