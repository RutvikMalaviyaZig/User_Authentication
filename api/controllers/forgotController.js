const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Sequelize = require('sequelize');
const HTTP_STATUS_CODE = require("../utils/httpStatusCodes");
const MESSAGES = require("../utils/Messages");
const User = require("../../db/models/user");


async function handleForgotPassword(req,res) {

    // Configure nodemailer for email sending
    const transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        auth: {
          user: "5c19c3eff3ac5b",
          pass: "1416a399058e95"
        }
  });

    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email } });
    
        if (!user) {
          return res.status(HTTP_STATUS_CODE.NOT_FOUND).json(MESSAGES.USER_NOT_FOUND);
        }
    
        // Generate token
        const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '10m' });
        const resetTokenExpiry = Date.now() + 600000; // 10 min expiration
    
        await user.update({ resetToken, resetTokenExpiry });
    
        // Send email
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        await transporter.sendMail({
          from: "no-reply@example.com",
          to: user.email,
          subject: 'Password Reset Request',
          html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`
        });
    
        res.json({
          message: MESSAGES.RESET_PASSWORD_EMAIL_SENT,
          resetTokenExpiry,
          resetToken
        });
    
      } catch (error) {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(MESSAGES.ERROR_PROCESSING_REQUEST + error);
      }
}


async function handleResetPassword(req,res) {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({ where: { resetTokenExpiry: { [Sequelize.Op.gt]: Date.now() } } });
    
        if (!user) {
          return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(MESSAGES.INVALID_OR_EXPIRED_TOKEN);
        }

        const barearToken = req.headers.authorization;
        if (!barearToken) {
          return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(MESSAGES.UNAUTHORIZED);
        }

        const AuthToken = barearToken.split(" ")[1];
        if (!AuthToken) {
          return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(MESSAGES.UNAUTHORIZED);
        }
        // Compare the provided token with the hashed token in the database
        const isTokenValid = jwt.verify(AuthToken, user.resetToken);
        if (!isTokenValid) {
          return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(MESSAGES.INVALID_TOKEN);
        }
    
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await user.update({ password: hashedPassword, resetToken: null, resetTokenExpiry: null });
    
        res.json(MESSAGES.PASSWORD_RESET_SUCCESSFUL);
    
      } catch (error) {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ 
          MESSAGES: MESSAGES.ERROR_PROCESSING_REQUEST, error });
      }
    
}


module.exports = {
    handleForgotPassword,
    handleResetPassword
}