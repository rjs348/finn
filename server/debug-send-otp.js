require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const Student = require('./models/Student');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function testSendOtp() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const testData = {
            name: 'Test Student',
            rollNumber: 'ROLL' + Math.floor(Math.random() * 1000),
            registerNumber: 'REG' + Math.floor(Math.random() * 1000),
            email: 'think13106@gmail.com'
        };

        console.log('Testing send-otp logic with:', testData);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

        const student = await Student.findOneAndUpdate(
            { rollNumber: testData.rollNumber },
            { name: testData.name, registerNumber: testData.registerNumber, email: testData.email, otp, otpExpiry },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        console.log('✅ Student upserted successfully:', student.rollNumber);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error caught:', error.message);
        console.error(error);
        process.exit(1);
    }
}

testSendOtp();
