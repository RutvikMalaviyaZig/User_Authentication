const {express} = require('../../Provider') 
const router = express.Router();
const { verifyAuthMiddleware } = require("../middlewares/verfiyAuthMIddleware");

router.get("/google", (req, res) => {
  res.render("google", { googleClientId: process.env.GOOGLE_CLIENT_ID });
});

router.get("/success", verifyAuthMiddleware, (req, res) => {
  res.render("success");
});

module.exports = router;
