require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { User } = require('../../db/models/user'); // Assuming Sequelize model is used


const saltRounds = 10;

const RESET_PASSWORD_EXPIRATION_TIME = '1h';  // Reset token expiration time
// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'b5ee2aa603fbf2',  // Your email
    pass: '201d79ada29c1f'    // Your email password or an app-specific password
  }
});

// 1. Forget Password (Send Reset Link)

async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Generate a reset token
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: RESET_PASSWORD_EXPIRATION_TIME });
      // Send reset email with the token link
      const resetLink = `http://your-frontend.com/reset-password?token=${token}`;
      const mailOptions = {
        from: 'sandbox.smtp.mailtrap.io',
        to: email,
        subject: 'Password Reset Request',
        text: `Click the link to reset your password: ${resetLink}`,
      };
      await transporter.sendMail(mailOptions);
      res.json({ message: 'Password reset link sent to your email.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }



// 2. Reset Password (User provides new password)
app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    // Verify the reset token
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update the password in the database
    user.password = hashedPassword;
    await user.save();
    res.json({ message: 'Password has been successfully updated' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
});






