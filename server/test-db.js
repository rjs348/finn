const mongoose = require('mongoose');
const dns = require('dns');

// Force use of public DNS servers to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();

const testConnection = async () => {
    console.log('Testing Alternative MongoDB Connection (Non-SRV)...');

    // Constructing a standard string from the hostnames we found
    // This bypasses the DNS SRV lookup (querySrv) which is failing in your network.
    const password = "pKrgoJFA3UsvnDAP";
    const manualUri = `mongodb+srv://admin:${password}@cluster0.jbkgllm.mongodb.net/election_db?retryWrites=true&w=majority&appName=Cluster0`;

    console.log('URI (hidden password):', manualUri.replace(/:([^@]+)@/, ':****@'));

    try {
        await mongoose.connect(manualUri, {
            connectTimeoutMS: 15000,
        });
        console.log('\n✅ SUCCESS: Successfully connected to MongoDB!');
        process.exit(0);
    } catch (err) {
        console.error('\n❌ ERROR: Connection failed.');
        console.error('Error Message:', err.message);
        process.exit(1);
    }
};

testConnection();
