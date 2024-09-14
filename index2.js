const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Array of events with email body templates
const events = [
    { name: 'signup', body: 'Thank you for signing up on our platform!' },
    { name: 'reminder', body: 'We miss you! Come back and explore new features.' },
    { name: 'specialOffer', body: 'Exclusive offer just for you! Click here to avail the discount.' },
];

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'bhaveshrgarg@gmail.com', // Replace with your email
    pass: 'kklxsurjouwnproh',    // Your Gmail app password
  },
});

// API route for sending emails with different events
app.post('/send-emails', (req, res) => {
  const { recipients } = req.body;

  // Check if recipients is an array
  if (!Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ message: 'Recipients must be an array and cannot be empty' });
  }

  // Iterate through each recipient and send the appropriate email
  let emailPromises = recipients.map(({ email, eventName }) => {
    // Find the corresponding event for the recipient
    const event = events.find(e => e.name === eventName);

    if (!event) {
      return Promise.reject(new Error(`Event "${eventName}" not found for ${email}`));
    }

    const mailOptions = {
      from: 'bhaveshrgarg@gmail.com',
      to: email,
      subject: `Event: ${eventName}`,
      text: event.body,  // You can also use HTML here if needed
    };

    // Send the email and return a promise
    return transporter.sendMail(mailOptions);
  });

  // Wait for all emails to be sent
  Promise.allSettled(emailPromises)
    .then(results => {
      const success = results.filter(result => result.status === 'fulfilled');
      const failures = results.filter(result => result.status === 'rejected');
      res.status(200).json({
        message: 'Email processing completed',
        success: success.map(result => result.value.accepted),
        failures: failures.map(result => result.reason.message),
      });
    })
    .catch(error => {
      res.status(500).json({ message: 'Failed to process emails', error });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
