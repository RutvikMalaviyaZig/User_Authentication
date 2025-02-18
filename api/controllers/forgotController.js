const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Sequelize = require("sequelize");
const { Op } = require('sequelize')
const HTTP_STATUS_CODE = require("../utils/httpStatusCodes");
const MESSAGES = require("../utils/Messages");
const User = require("../../db/models/user");
const { v4: uuidv4 } = require('uuid');

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
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .json(MESSAGES.USER_NOT_FOUND);
    }

    // Generate token
    const resetToken = uuidv4();
    const resetTokenExpiry = Date.now() + 600000; // 10 min expiration

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

async function handleResetPassword(req, res) {
  try {
    const { resetToken, newPassword } = req.body;
    console.log(req.body);
    const user = await User.findOne({
      where: { resetTokenExpiry: { [Sequelize.Op.gt]: Date.now() } },
    });
    console.log(user);

    if (!user) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(MESSAGES.INVALID_OR_EXPIRED_TOKEN);
    }

    // const barearToken = req.headers.authorization;
    // if (!barearToken) {
    //   return res
    //     .status(HTTP_STATUS_CODE.UNAUTHORIZED)
    //     .json(MESSAGES.UNAUTHORIZED);
    // }
    // const AuthToken = barearToken.split(" ")[1];
    // if (!AuthToken) {
    //   return res
    //     .status(HTTP_STATUS_CODE.UNAUTHORIZED)
    //     .json(MESSAGES.UNAUTHORIZED);
    // }
    const tokenCheckInDB = await User.findOne({
      where: { resetToken: { [Op.eq]: resetToken }  },
    });

    
  

    if (!tokenCheckInDB) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(MESSAGES.INVALID_TOKEN);
    }
    // Compare the provided token with the hashed token in the database
    // const isTokenValid = jwt.verify(AuthToken, user.resetToken);
    // if (!isTokenValid) {
    //   return res
    //     .status(HTTP_STATUS_CODE.BAD_REQUEST)
    //     .json(MESSAGES.INVALID_TOKEN);
    // }


    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
 
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
