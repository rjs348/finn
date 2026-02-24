require('dotenv').config({ path: '.env' });
const mongoose = require('mongoose');
const Candidate = require('./models/Candidate');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function addCandidates() {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        const candidatesToCreate = [
            {
                name: "Ananya Sharma",
                course: "CSE",
                photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
                status: "active"
            },
            {
                name: "Rahul Verma",
                course: "ECE",
                photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
                status: "active"
            },
            {
                name: "Sanya Gupta",
                course: "Mechanical",
                photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
                status: "active"
            }
        ];

        console.log('Adding 3 candidates...');
        const result = await Candidate.insertMany(candidatesToCreate);
        console.log('✅ Successfully added:');
        result.forEach(c => console.log(` - ${c.name} (${c.course})`));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error adding candidates:', error.message);
        process.exit(1);
    }
}

addCandidates();
