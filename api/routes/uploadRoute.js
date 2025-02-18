const { express } = require("../../Provider");
const multer = require("multer");
const path = require("path");
const Media = require("../../db/models/media");
const Admin = require("../../db/models/admin");
const fs = require('fs')

const MESSAGES = require('../utils/Messages');
const HTTP_STATUS_CODE = require("../utils/httpStatusCodes")

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage }).single("file");


// for the upload the file 
router.post("/upload", upload, async (req, res) => {
  try {

    const file = req.file;
    if (!file) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({
        message : MESSAGES.FILE_NOT_UPLOADED,
      });
    }

    const url = `http://localhost:5000/uploads/${file.filename}`;  // url for the view image 

    // create media in media table
    await Media.create({
      url: url,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      originalname: req.file.originalname,
    });

    res.status(HTTP_STATUS_CODE.OK).json({ message: MESSAGES.FILE_UPLOADED_SUCCESSFULLY });
  } catch (error) {
    res.json({ message: error.message });
  }
});


// for the create admin with refering media id
router.post("/edituser", async (req, res) => {
  try {
    const { firstName, lastName, profileImgUrl } = req.body;

    // create admin in database ans set profileImgUrl to media id
    await Admin.create({
      firstName: firstName,
      lastName: lastName,
      profileImgUrl: profileImgUrl,
    });

    res.status(HTTP_STATUS_CODE.CREATED).json({ message: MESSAGES.USER_CREATED });   
  } catch (error) {
    res.json({ message: error.message });
  }
});



// for delete the img 
router.post("/deleteImg", async (req, res) => {
    try {
        const { id } = req.body;

        // find media by id
        const media = await Media.findByPk(id);

        // if no media the give error 
        if (!media) {
        return res.json({ message: "media not found" });
        }

        //  remove from the server 
        await media.destroy();
        // fs.unlinkSync(media.url)
        res.status(HTTP_STATUS_CODE.OK).json({ message: MESSAGES.MEDIA_DELETED_SUCCESSFULLY });
    } catch (error) {
        res.json({ message: error.message });
    }
});

module.exports = router;
