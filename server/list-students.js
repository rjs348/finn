require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const Student = require('./models/Student');
const dns = require('dns');

async function listStudents() {
    try {
        console.log('Connecting to DB...');
        // We use the simpler setServers call if the array one fails
        try { dns.setServers(['8.8.8.8']); } catch (e) { }

        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const students = await Student.find({}, 'name rollNumber registerNumber email');
        console.log('Students List:');
        students.forEach(s => {
            console.log(` - ${s.name} | Roll: ${s.rollNumber} | Reg: ${s.registerNumber} | Email: ${s.email}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

listStudents();
