require('dotenv').config({ path: 'server/.env' });
const { sendResetPasswordEmail } = require('./server/config/emailConfig');

async function test() {
    try {
        console.log('Testing Admin Reset Email...');
        await sendResetPasswordEmail('think13106@gmail.com', 'riya', 'test_temp_pass_123');
        console.log('✅ Success: Reset email sent!');
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

test();
