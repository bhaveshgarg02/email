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
    pass: 'kklxsurjouwnproh',    // Your Gmail app password
  },
});

app.post('/send-emails', (req, res) => {
  const { recipients } = req.body;

  
  if (!Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ message: 'Recipients must be an array and cannot be empty' });
  }

  let emailPromises = recipients.map(({ email, eventName }) => {
    
    const event = events.find(e => e.name === eventName);

    if (!event) {
      return Promise.reject(new Error(`Event "${eventName}" not found for ${email}`));
    }

    const mailOptions = {
      from: 'bhaveshrgarg@gmail.com',
      to: email,
      subject: `Event: ${eventName}`,
      text: event.body, 
    };

    return transporter.sendMail(mailOptions);
  });

 
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


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
