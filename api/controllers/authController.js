const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const verifyToken = require("../utils/verifyGoogle");
const HTTP_STATUS_CODE = require("../utils/httpStatusCodes");
const MESSAGES = require("../utils/Messages");
const User = require("../../db/models/user");

// function for the signup
const handleSignup = async (req, res) => {
  const { firstName, lastName, email, password, mobile } = req.body;

  try {
    // validate all fields are require
    if (!firstName || !lastName || !email || !password || !mobile) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(MESSAGES.ALL_FIELDS_REQUIRED);
    }

    // if all field is fullfield the generate hash password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    // select all fields for create user in database
    const userData = {
      firstName,
      lastName,
      email,
      mobile,
      password: hashPassword,
    };

    // check email already is exist in database or not
    const existEmail = await User.findOne({ where: { email } });
    if (existEmail) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(MESSAGES.EMAIL_ALREADY_EXIST);
    }

    // check mobile already is exist in database or not
    const existMobile = await User.findOne({ where: { mobile } });
    if (existMobile) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(MESSAGES.MOBILE_ALREADY_EXIST);
    }

    // create user
    const user = await User.create(userData);
    res.json({ message: MESSAGES.USER_CREATED, user });
  } catch (error) {
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json(MESSAGES.INTERNAL_SERVER_ERROR + error.message);
  }
};

// function for handle email login
const handleEmailLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check email or password is given or not
    if (!email || !password) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(MESSAGES.ALL_FIELDS_REQUIRED);
    }

    // find user based on the email
    const user = await User.findOne({ where: { email } });

    // if no user then through error
    if (!user) {
      return res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .json(MESSAGES.USER_NOT_FOUND);
    }

    // compare password in databse with given password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(HTTP_STATUS_CODE.UNAUTHORIZED)
        .json(MESSAGES.INVALID_PASSWORD);
    }

    // create payload
    const payload = {
      id: user.id,
      email: user.email,
    };

    // generate token
    const token = generateToken(payload);
    return res.status(HTTP_STATUS_CODE.OK).json({
      message: MESSAGES.USER_LOGGED_IN_SUCCESSFULLY,
      token,
    });
  } catch (error) {
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

//
const handleMobileLogin = async (req, res) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return res
      .status(HTTP_STATUS_CODE.ALL_FIELDS_REQUIRED)
      .json(MESSAGES.ALL_FIELDS_REQUIRED);
  }

  try {
    const user = await User.findOne({ where: { mobile } });
    if (!user) {
      return res
        .status(HTTP_STATUS_CODE.NOT_FOUND)
        .json(MESSAGES.USER_NOT_FOUND);
    }
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(HTTP_STATUS_CODE.UNAUTHORIZED)
        .json(MESSAGES.INVALID_PASSWORD);
    }
    const payload = {
      id: user.id,
      mobile: user.mobile,
    };
    const token = generateToken(payload);
    return res
      .status(HTTP_STATUS_CODE.OK)
      .json(MESSAGES.USER_LOGGED_IN_SUCCESSFULLY + token);
  } catch (error) {
    return res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

// function for handle email login
const handleGoogleLogin = async (req, res) => {
  const token = req.body.token;
  try {
    // check token
    if (!token) {
      return res
        .status(HTTP_STATUS_CODE.BAD_REQUEST)
        .json(MESSAGES.ALL_FIELDS_REQUIRED);
    }

    // take info from the token
    const payload = await verifyToken(token);

    // check user is existing or not
    const existingUser = await User.findOne({
      where: { email: payload.email },
    });

    // create payload using email or id
    const jwtPayload = {
      email: payload.email,
    };

    // if no existing user the create it
    if (!existingUser) {
      const newUser = await User.create({
        id: uuidv4(),
        firstName: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
      });
      // if user create then id is this
      jwtPayload.id = newUser.id;
    } else {
      // else this
      jwtPayload.id = existingUser.id;
    }

    // generate jwt token
    const jwtToken = generateToken(jwtPayload);

    // send responses
    res.json({
      message: MESSAGES.USER_LOGGED_IN_SUCCESSFULLY,
      success: true,
      token: jwtToken,
    });
  } catch (error) {
    res
      .status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR)
      .json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

// simpal logout route
const handleLogout = (req, res) => {
  res.json({ message: MESSAGES.USER_LOGOUT });
};

module.exports = {
  handleSignup,
  handleEmailLogin,
  handleMobileLogin,
  handleGoogleLogin,
  handleLogout,
};
