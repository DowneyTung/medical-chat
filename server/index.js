const express = require('express');
const cors = require('cors');

const authRoutes = require("./routes/auth.js");

const app = express(); //create instance of that express app
const PORT = process.env.PORT || 5000; //specify the backend port for our node server

require('dotenv').config(); // this allows us to call the env variable inside the node application  

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const twilioClient = require('twilio')(accountSid, authToken);

//setup the middleware
app.use(cors()); //allow us make cross origin request
app.use(express.json()); //this will allow us to pass json payload from front end to backend
app.use(express.urlencoded());

app.get('/', (req, res) => {
  res.send('Hello, Wrold!');
})

app.use('/auth', authRoutes);

app.post('/', (req, res) => {
  const { message, user: sender, type, members } = req.body;

  if (type === 'message.new') {
    members
      .filter((member) => member.user_id !== sender.id)
      .forEach(({ user }) => {
        if (!user.online) {
          twilioClient.messages.create({
            body: `You have a new message from ${message.user.fullName} - ${message.text}`,
            messagingServiceSid: messagingServiceSid,
            to: user.phoneNumber
          })
            .then(() => console.log('Message sent!'))
            .catch((err) => console.log(err));
        }
      })

    return res.status(200).send('Message sent!');
  }

  return res.status(200).send('Not a new message request');
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));