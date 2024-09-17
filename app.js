const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();
const fetch = require('node-fetch');

const client = new Client({
    authStrategy: new LocalAuth(),
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

client.on('message', message => {
    const user_input = message.body;
    console.log(user_input);

    query({ "prompt": user_input }).then(result => {
        console.log(result);
        console.log();

        client.sendMessage(message.from, result);
    }).catch(error => {
        console.error('Error querying the endpoint:', error);
        client.sendMessage(message.from, 'Sorry, there was an error processing your request.');
    });
});

async function query(data) {
    try {
        const response = await fetch(
            process.env.ENDPOINT_URL,
            {
                headers: {
                    'Authorization': `Bearer ${process.env.BEARER_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(data),
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result.message;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}