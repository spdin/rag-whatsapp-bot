// Import necessary modules
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config(); // Load environment variables from .env file

// Create a new WhatsApp client with local authentication
const client = new Client({
    authStrategy: new LocalAuth(),
});

// Generate and display QR code for authentication
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

// Log when the client is authenticated
client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

// Log when the client is ready to use
client.on('ready', () => {
    console.log('Client is ready!');
});

// Initialize the client
client.initialize();

// Listen for incoming messages
client.on('message', message => {
    // Get the message body (user input)
    const user_input = message.body;
    console.log(user_input);

    // Send the user input to the query function and handle the response
    query({ "prompt": user_input }).then(result => {
        console.log(result);
        console.log();

        // Send the response back to the user
        client.sendMessage(message.from, result);
    });
});

// Function to query the external API
async function query(data) {
    const response = await fetch(
        "https://llm.datasaur.ai/api/sandbox/255/1922/ragparenting",
        {
            headers: {
                'Authorization': `Bearer ${process.env.BEARER_TOKEN}`, // Use the token from the .env file
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(data), // Convert data to JSON string
        }
    );
    const result = await response.json(); // Parse the JSON response
    return result.message; // Return the message from the response
}
