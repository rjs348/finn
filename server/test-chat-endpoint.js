const axios = require('axios');

async function testChatEndpoint() {
    try {
        console.log('Sending message to /api/chat...');
        const response = await axios.post('http://localhost:5000/api/chat', {
            message: "How do I vote in this system?"
        });

        console.log('--- Chatbot Response ---');
        console.log(JSON.stringify(response.data, null, 2));
        console.log('------------------------');

        if (response.data.reply) {
            console.log('✅ Success! The chatbot is integrated and working.');
        } else {
            console.log('❌ Failed: No reply received.');
        }
    } catch (error) {
        console.error('❌ Endpoint Error:', error.response ? error.response.data : error.message);
    }
}

testChatEndpoint();
