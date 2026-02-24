require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const Candidate = require('./models/Candidate');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const names = ["Arun Kumar", "Bhavya Sri", "Chaitanya", "Deepika", "Eswar Rao", "Farhan", "Gautami", "Harish", "Ishwarya", "Jeevan"];
const depts = ["CSE", "ECE", "EEE", "Mechanical", "Civil"];
const sems = ["2nd Sem", "4th Sem", "6th Sem", "8th Sem"];

async function seedRandom() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const candidatesToCreate = [];
        for (let i = 0; i < 5; i++) {
            const name = names[Math.floor(Math.random() * names.length)];
            const dept = depts[Math.floor(Math.random() * depts.length)];
            const sem = sems[Math.floor(Math.random() * sems.length)];

            candidatesToCreate.push({
                name: `${name} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`, // Add a random initial
                course: dept,
                year: sem,
                manifesto: `Vote for ${name} for a better campus!`,
                photo: `https://i.pravatar.cc/150?u=${Math.random()}`
            });
        }

        console.log(`Seeding 5 random candidates...`);
        const result = await Candidate.insertMany(candidatesToCreate);
        console.log('✅ Successfully added:');
        result.forEach(c => console.log(` - ${c.name} (${c.course}, ${c.year})`));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding candidates:', error.message);
        process.exit(1);
    }
}

seedRandom();
