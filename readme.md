# Stream Chat Tutorial

This is a tutorial on how to use the Stream Chat API with a Node.js and Express backend.

## Setup

1. Create a new Stream Chat account and get your API key and secret.
2. Install the Stream Chat SDK using npm or yarn: `npm install stream-chat` or `yarn add stream-chat`.
3. Create a new file called `stream.js` and import the Stream Chat SDK.
4. Initialize the Stream Chat client with your API key and secret.
5. Create a new user and get their ID.
6. Create a new channel and add the user to it.

## Sending a Message

1. Create a new message object with the text and user ID.
2. Use the `sendMessage` method of the Stream Chat client to send the message.

## Getting Messages

1. Use the `getMessages` method of the Stream Chat client to get the messages in the channel.
2. Loop through the messages and print out the text and user ID.

## Running the App

1. Run the app with `node stream.js`.
2. Open a web browser and go to `http://localhost:3000`.
3. You should see the messages in the channel.

## Conclusion

This is a basic tutorial on how to use the Stream Chat API with a Node.js and Express backend. You can add more features such as user authentication and more.
