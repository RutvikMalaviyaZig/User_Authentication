const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Sequelize = require("sequelize");
const { Op } = require('sequelize')
const HTTP_STATUS_CODE = require("../utils/httpStatusCodes");
const MESSAGES = require("../utils/Messages");
const User = require("../../db/models/user");
const { v4: uuidv4 } = require('uuid');



// for the forgot passward
async function handleForgotPassword(req, res) {

  // Configure nodemailer for email sending
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    auth: {
      user: "90264eb632827a",
      pass: "c0bec5345016ce",
    },
  });

  try {
    const { email } = req.body;
    // find in database using email
    const user = await User.findOne({ where: { email } });

    // if not then give error
    if (!user) {
      return res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .json(MESSAGES.USER_NOT_FOUND);
    }

    // Generate token
    const resetToken = uuidv4();
    const resetTokenExpiry = Date.now() + 600000; // 10 min expiration

    // update resetToken AND resetTokenExpiry in database
    await user.update({ resetToken, resetTokenExpiry });

    // Send email
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await transporter.sendMail({
      from: "no-reply@example.com",
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    res.json({
      message: MESSAGES.RESET_LINK_SENT,
      resetTokenExpiry,
      resetToken,
    });
  } catch (error) {
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json(MESSAGES.ERROR_PROCESSING_REQUEST + error);
  }
}


// when clik on link then goto reset-password api 
async function handleResetPassword(req, res) {
  try {
    const { resetToken, newPassword } = req.body;
   
    // match the expiry of the token and find user based on it
    const user = await User.findOne({
      where: { resetTokenExpiry: { [Sequelize.Op.gt]: Date.now() } },
    });

    // if no user then it through error
    if (!user) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(MESSAGES.INVALID_OR_EXPIRED_TOKEN);
    }

    // find user based on the resetToken
    const tokenCheckInDB = await User.findOne({
      where: { resetToken: { [Op.eq]: resetToken }  },
    });

    
    // if no token then through error
    if (!tokenCheckInDB) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(MESSAGES.INVALID_TOKEN);
    }

    // Hash the new password if token is exist
    const hashedPassword = await bcrypt.hash(newPassword, 10);
 
    // update password  in database and set resetToken AND resetTokenExpiry null in database
    await User.update(
      {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
      {
        where: {
          email : user.dataValues.email,
        }
      }
    );
    res.json(MESSAGES.PASSWORD_RESET_SUCCESSFUL);
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
      MESSAGES: MESSAGES.ERROR_PROCESSING_REQUEST,
      error,
    });
  }
}

module.exports = {
  handleForgotPassword,
  handleResetPassword,
};
