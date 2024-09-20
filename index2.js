const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
const port = 3001;

app.use(bodyParser.json());


const emailTemplates = [
  {
    title: "welcome",
    subject: "Welcome to our platform!",
    html: `
          <html>
            <body style="background-color:#f2f2f2; font-family: Arial, sans-serif; padding:20px;">
              <div style="max-width:600px; margin:0 auto; background-color:#ffffff; padding:20px; border-radius:8px;">
                <h1 style="color:#333; text-align:center;">Welcome!</h1>
                <p style="color:#555;">Thank you for signing up to our platform. We are thrilled to have you!</p>
                <img src="https://via.placeholder.com/600x200" alt="Welcome Image" style="width:100%; height:auto; border-radius:8px; margin:20px 0;">
                <p style="color:#555; text-align:center;">We hope you enjoy our services. Don't hesitate to explore our platform and discover everything we offer.</p>
              </div>
              
              <!-- Footer -->
              <div style="background-color:#f2f2f2; padding:20px; text-align:center;">
                <p style="color:#888888;">&copy; 2024 Your Company. All rights reserved.</p>
              </div>
            </body>
          </html>
        `,
  },
  {
    title: "reminder",
    subject: "Reminder: Visit our platform",
    html: `
          <html>
            <body style="background-color:#f2f2f2; font-family: Arial, sans-serif; padding:20px;">
              <div style="max-width:600px; margin:0 auto; background-color:#ffffff; padding:20px; border-radius:8px;">
                <h2 style="color:#333; text-align:center;">We Miss You!</h2>
                <p style="color:#555;">It's been a while since we last saw you. Come back and check out the latest features and updates on our platform!</p>
                <img src="https://via.placeholder.com/600x200" alt="Reminder Image" style="width:100%; height:auto; border-radius:8px; margin:20px 0;">
                <p style="text-align:center;">
                  <a href="" style="background-color:#ff6f61; color:#ffffff; padding:10px 20px; text-decoration:none; border-radius:5px; font-size:18px; display:inline-block;">
                    Visit Our Platform
                  </a>
                </p>
              </div>

              <!-- Footer -->
              <div style="background-color:#f2f2f2; padding:20px; text-align:center;">
                <p style="color:#888888;">&copy; 2024 Your Company. All rights reserved.</p>
              </div>
            </body>
          </html>
        `,
  },
  {
    title: "specialOffer",
    subject: "Exclusive Offer Just for You!",
    html: `
          <html>
            <body style="background-color:#f2f2f2; font-family: Arial, sans-serif; padding:20px;">
              <div style="max-width:600px; margin:0 auto; background-color:#ffffff; padding:20px; border-radius:8px;">
                <!-- Preheader text (hidden in email clients) -->
                <div style="display:none; max-height:0; overflow:hidden;">Exclusive Promotion Just for You</div>

                <!-- Main Content -->
                <h1 style="color:#333; text-align:center;">Exclusive Promotion Just for You!</h1>
                <p style="color:#555; text-align:center;">Hello, valued customer! We're excited to offer you an exclusive promotion.</p>
                <img src="https://via.placeholder.com/600x200" alt="Promotional Image" style="width:100%; height:auto; border-radius:8px; margin:20px 0;">
                <p style="text-align:center;">
                  <a href="" style="background-color:#ff6f61; color:#ffffff; padding:10px 20px; text-decoration:none; border-radius:5px; font-size:18px; display:inline-block;">
                    Redeem Your Offer
                  </a>
                </p>

                <!-- Footer -->
                <div style="background-color:#f2f2f2; padding:20px; text-align:center;">
                  <p>Follow us on:</p>
                  <a href="" style="margin-right:10px;">
                    <img src="https://e7.pngegg.com/pngimages/991/568/png-clipart-facebook-logo-computer-icons-facebook-logo-facebook-thumbnail.png" width='24' height='24' alt="Facebook">
                  </a>
                  <a href="" style="margin-right:10px;">
                    <img src="https://w7.pngwing.com/pngs/742/514/png-transparent-logo-youtube-twitter-bird-blue-logo-computer-wallpaper-thumbnail.png" width='24' height='24' alt="Twitter">
                  </a>
                  <a href="">
                    <img src="https://image.similarpng.com/very-thumbnail/2020/06/Instagram-logo-transparent-PNG.png" width='24' height='24' alt="Instagram">
                  </a>
                  <p style="margin-top:20px;">
                    <a href="#" style="color:#888888; text-decoration:underline;">Unsubscribe</a> | 
                    <a href="" style="color:#888888; text-decoration:none;">Visit our website</a>
                  </p>
                  <p>&copy; 2024 Your Company. All rights reserved.</p>
                </div>
              </div>
            </body>
          </html>
        `,
  },
];


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bhaveshrgarg@gmail.com", // Replace with your email
    pass: "kklxsurjouwnproh", // Gmail App password
  },
});

app.post("/send-emails", (req, res) => {
  const { recipients } = req.body;

  if (!Array.isArray(recipients) || recipients.length === 0) {
    return res
      .status(400)
      .json({ message: "Recipients must be an array and cannot be empty" });
  }

  const emailPromises = recipients.map(({ email, title }) => {
    const template = emailTemplates.find((t) => t.title === title);

    if (!template) {
      return Promise.reject(new Error(`No template found for title: ${title}`));
    }

    const mailOptions = {
      from: "bhaveshrgarg@gmail.com", 
      to: email,
      subject: template.subject, 
      html: template.html, 
    };

    return transporter.sendMail(mailOptions);
  });

  Promise.allSettled(emailPromises)
    .then((results) => {
      const success = results.filter((result) => result.status === "fulfilled");
      const failures = results.filter((result) => result.status === "rejected");
      res.status(200).json({
        message: "Email processing completed",
        success: success.map((result) => result.value.accepted),
        failures: failures.map((result) => result.reason.message),
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "Failed to process emails", error });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
