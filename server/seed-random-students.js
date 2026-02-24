require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const Student = require('./models/Student');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const names = ["Aravind", "Bindu", "Charan", "Divya", "Eswar", "Fathima", "Ganesh", "Harini", "Imran", "Jyothi", "Karthik", "Laxmi", "Manoj", "Nandini", "Omar", "Priya", "Rahul", "Sneha", "Tarun", "Usha"];

async function seedStudents() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const studentsToCreate = [];
        const timestamp = Date.now().toString().slice(-4);

        for (let i = 0; i < 10; i++) {
            const name = names[Math.floor(Math.random() * names.length)];
            const randomSuffix = Math.floor(1000 + Math.random() * 9000);

            studentsToCreate.push({
                name: `${name} ${String.fromCharCode(65 + i)}`,
                rollNumber: `STU${timestamp}${i}`,
                registerNumber: `REG${timestamp}${i}${randomSuffix}`,
                email: `${name.toLowerCase()}.${timestamp}${i}@example.com`,
                hasVoted: false
            });
        }

        console.log(`Seeding 10 random students...`);
        const result = await Student.insertMany(studentsToCreate);
        console.log('✅ Successfully added:');
        result.forEach(s => console.log(` - ${s.name} | Roll: ${s.rollNumber} | Email: ${s.email}`));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding students:', error.message);
        process.exit(1);
    }
}

seedStudents();
