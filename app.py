import telebot
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize the bot with the token
bot = telebot.TeleBot(os.getenv('TELEGRAM_BOT_TOKEN'))

# Function to query the external API
def query(data):
    try:
        response = requests.post(
            os.getenv('ENDPOINT_URL'),
            headers={
                'Authorization': f'Bearer {os.getenv("BEARER_TOKEN")}',
                'Content-Type': 'application/json'
            },
            json=data
        )
        response.raise_for_status()
        result = response.json()
        return result.get('message')
    except requests.RequestException as error:
        print(f'Error fetching data: {error}')
        return 'Sorry, there was an error processing your request.'

# Function to handle incoming messages
@bot.message_handler(func=lambda message: True)
def handle_message(message):
    user_input = message.text
    print(user_input)

    result = query({"prompt": user_input})
    print(result)

    bot.send_message(message.chat.id, result)

# Start polling for messages
bot.polling()