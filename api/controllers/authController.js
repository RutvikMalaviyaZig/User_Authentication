const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const verifyToken = require("../utils/verifyGoogle");
const HTTP_STATUS_CODE = require("../utils/httpStatusCodes");
const MESSAGES = require("../utils/Messages");
const User = require("../../db/models/user");


const handleSignup = async (req, res) => {
  const { firstName, lastName, email, password, mobile } = req.body;
  
  try {
     if (!firstName || !lastName || !email || !password || !mobile) {
    return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(MESSAGES.ALL_FIELDS_REQUIRED);
  }
  

  
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);
  const userData = {
    firstName,
    lastName,
    email,
    mobile,
    password: hashPassword,
  };

    const existEmail = await User.findOne({ where: { email } });
    if (existEmail) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(MESSAGES.EMAIL_ALREADY_EXIST);
    }
    const existMobile = await User.findOne({ where: { mobile } });
    if (existMobile) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(MESSAGES.MOBILE_ALREADY_EXIST);
    }
    console.log("rghsteyjtsr");
   const user = await User.create(userData);
   res.json({ message: "User created successfully", user });
  } catch (error) {
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json(MESSAGES.INTERNAL_SERVER_ERROR + error.message);
  }
};

const handleEmailLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(MESSAGES.ALL_FIELDS_REQUIRED);
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json(MESSAGES.USER_NOT_FOUND);
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(MESSAGES.INVALID_PASSWORD);
    }
    const payload = {
      id: user.id,
      email: user.email,
    };
    const token = generateToken(payload);
    return res.status(HTTP_STATUS_CODE.OK).json({
      message: MESSAGES.USER_LOGGED_IN_SUCCESSFULLY,
      token,
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

const handleMobileLogin = async (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res.status(HTTP_STATUS_CODE.ALL_FIELDS_REQUIRED).json(MESSAGES.ALL_FIELDS_REQUIRED);
  }

  try {
    const user = await User.findOne({ where: { mobile } });
    if (!user) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json(MESSAGES.USER_NOT_FOUND);
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).json(MESSAGES.INVALID_PASSWORD);
    }
    const payload = {
      id: user.id,
      mobile: user.mobile,
    };
    const token = generateToken(payload);
    return res.status(HTTP_STATUS_CODE.OK).json(MESSAGES.USER_LOGGED_IN_SUCCESSFULLY + token);
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

const handleGoogleLogin = async (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json(MESSAGES.ALL_FIELDS_REQUIRED);
  }

  try {
    const payload = await verifyToken(token);
    const existingUser = await User.findOne({
      where: { email: payload.email },
    });
    const jwtPayload = {
      email: payload.email,
    };
    if (!existingUser) {
      const newUser = await User.create({
        id: uuidv4(),
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
      });
      jwtPayload.id = newUser.id;
    } else {
      jwtPayload.id = existingUser.id;
    }

    const jwtToken = generateToken(jwtPayload);

    res.json({
      message: "User logged in successfully",
      success: true,
      token: jwtToken,
    });
  } catch (error) {
    res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

const handleLogout = (req, res) => {
  res.json({ message: "User logout" });
};


module.exports = {
  handleSignup,
  handleEmailLogin,
  handleMobileLogin,
  handleGoogleLogin,
  handleLogout,
};
