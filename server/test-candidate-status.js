const axios = require('axios');
const mongoose = require('mongoose');
const Candidate = require('./models/Candidate');
require('dotenv').config();

async function runTest() {
    try {
        const API_URL = 'http://localhost:5000/api';

        // Connect to DB directly for setup
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // 1. Clear existing candidates (optional/careful)
        // await Candidate.deleteMany({});

        // 2. Create an active candidate
        const activeCandidate = await Candidate.findOne({ status: 'active' }) || await Candidate.create({
            name: 'Active Test',
            course: 'CSE',
            status: 'active'
        });
        console.log('Active candidate:', activeCandidate.name);

        // 3. Create an inactive candidate
        const inactiveCandidate = await Candidate.findOne({ status: 'inactive' }) || await Candidate.create({
            name: 'Inactive Test',
            course: 'ECE',
            status: 'inactive'
        });
        console.log('Inactive candidate:', inactiveCandidate.name);

        // 4. Test public endpoint
        const publicResponse = await axios.get(`${API_URL}/candidates`);
        const publicCandidates = publicResponse.data;
        console.log('Public candidates count:', publicCandidates.length);

        const hasInactive = publicCandidates.some(c => c.status === 'inactive');
        if (hasInactive) {
            console.error('FAIL: Public endpoint returned inactive candidates!');
        } else {
            console.log('SUCCESS: Public endpoint filtered inactive candidates.');
        }

        // Note: Admin endpoint requires token, hard to test without full flow here
        // But the DB check and public filter are the core logic.

        await mongoose.disconnect();
    } catch (err) {
        console.error('Test error:', err.message);
        process.exit(1);
    }
}

runTest();
