const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());


const events = [
    { name: 'signup', body: 'Thank you for signing up on our platform!' },
    { name: 'reminder', body: 'We miss you! Come back and explore new features.' },
    { name: 'specialOffer', body: 'Exclusive offer just for you! Click here to avail the discount.' },
  ];
  


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bhaveshrgarg@gmail.com', // Replace with your email
    pass: 'kklxsurjouwnproh',  // Replace with your email password
  },
});

// API route for sending email based on event
app.post('/send-email', (req, res) => {
  const { email, eventName } = req.body;

  // Find the event
  const event = events.find(e => e.name === eventName);

  if (!event) {
    return res.status(404).json({ message: 'Event not found' });
  }

  // Set up email options
  const mailOptions = {
    from: 'bhaveshrgarg@gmail.com',
    to: email,
    subject: `Event: ${eventName}`,
    text: event.body,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: 'Failed to send email' });
    }
    console.log('Email sent: ' + info.response);
    res.status(200).json({ message: 'Email sent successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
