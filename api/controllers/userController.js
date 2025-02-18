const HTTP_STATUS_CODE = require("../utils/httpStatusCodes");
const MESSAGES = require("../utils/Messages");
const User = require("../../db/models/user");

// get userProfile
const handleGetProfile = async (req, res) => {
  const { id } = req.user;
  try {
    // find user based on the id 
    const user = await User.findOne({ where: { id } });
    // if user not found the through error
    if (!user) {
      return res.status(HTTP_STATUS_CODE.NOT_FOUND).json(MESSAGES.USER_NOT_FOUND);
    }
    // else give user details
    return res.status(HTTP_STATUS_CODE.OK).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
    });
  } catch (error) {
    return res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json(MESSAGES.INTERNAL_SERVER_ERROR);
  }
};

module.exports = { handleGetProfile };
