const { express } = require("../../Provider");
const multer = require("multer");
const path = require("path");
const Media = require("../../db/models/media");
const Admin = require("../../db/models/admin");
const { url } = require("inspector");

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

router.post("/upload", upload, async (req, res) => {
  try {
    console.log(req.body);
    const file = req.file;
    if (!file) {
      return res.json({ message: "file not uploaded" });
    }

    const url = `http://localhost:5000/uploads/${file.filename}`;
    const data = await Media.create({
      url: url,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      originalname: req.file.originalname,
    });
    console.log(data);
    res.json({ message: "file uploaded successfully" });
  } catch (error) {
    res.json({ message: error.message });
  }
});

router.post("/edituser", async (req, res) => {
  try {
    const { firstName, lastName, profileImgUrl } = req.body;

    await Admin.create({
      firstName: firstName,
      lastName: lastName,
      profileImgUrl: profileImgUrl,
    });

    res.json({ message: "user created" });   
  } catch (error) {
    res.json({ message: error.message });
  }
});

module.exports = router;
