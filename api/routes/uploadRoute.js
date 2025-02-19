const { express } = require("../../Provider");
const multer = require("multer");
const path = require("path");
const {
  handleUpload,
  handleEditUser,
  handleDeleteImg,
} = require("../controllers/imgUploadingController");

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
router.post("/upload", upload, handleUpload);

// for the create admin with refering media id
router.post("/edituser", handleEditUser);

// for delete the img
router.post("/deleteImg", handleDeleteImg);

module.exports = router;
