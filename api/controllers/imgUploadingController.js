const multer = require("multer");
const path = require("path");
const Media = require("../../db/models/media");
const Admin = require("../../db/models/admin");
const fs = require("fs");

const MESSAGES = require("../utils/Messages");
const HTTP_STATUS_CODE = require("../utils/httpStatusCodes");


const handleUpload = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message: MESSAGES.FILE_NOT_UPLOADED,
      });
    }

    const url = `http://localhost:5000/uploads/${file.filename}`; // url for the view image

    // create media in media table
    await Media.create({
      url: url,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      originalname: req.file.originalname,
    });

    
    res
      .status(HTTP_STATUS_CODE.OK)
      .json({ message: MESSAGES.FILE_UPLOADED_SUCCESSFULLY ,
        data : file
      });
  } catch (error) {
    res.json({ message: error.message });
  }
};

const handleEditUser = async (req, res) => {
  try {
    const { firstName, lastName, profileImgUrl } = req.body;

    // create admin in database ans set profileImgUrl to media id
    await Admin.create({
      firstName: firstName,
      lastName: lastName,
      profileImgUrl: profileImgUrl,
    });

    res
      .status(HTTP_STATUS_CODE.CREATED)
      .json({ message: MESSAGES.USER_CREATED });
  } catch (error) {
    res.json({ message: error.message });
  }
};

const handleDeleteImg = async (req, res) => {
  try {
    const { id } = req.body;

    // find media by id
    const media = await Media.findByPk(id);

    // if no media the give error
    if (!media) {
      return res.json({ message: MESSAGES.MEDIA_NOT_FOUND });
    }

    //  remove from the server
    await media.destroy();
    // fs.unlinkSync(media.url)
    res
      .status(HTTP_STATUS_CODE.OK)
      .json({ message: MESSAGES.MEDIA_DELETED_SUCCESSFULLY });
  } catch (error) {
    res.json({ message: error.message });
  }
};

module.exports = {
  handleUpload,
  handleEditUser,
  handleDeleteImg,
};
