const {express} = require('../../Provider') 
const router = express.Router();
const { verifyAuthMiddleware } = require("../middlewares/verfiyAuthMIddleware");
const { handleGetProfile } = require("../controllers/userController");


router.get("/profile", verifyAuthMiddleware, handleGetProfile);

module.exports = router;
