const {express} = require('../../Provider')
const { verifyAuthMiddleware } = require("../middlewares/verfiyAuthMIddleware");
const {router} = require('../../Provider')

router.get("/google", (req, res) => {
  res.render("google", { googleClientId: process.env.GOOGLE_CLIENT_ID });
});

router.get("/success", verifyAuthMiddleware, (req, res) => {
  res.render("success");
});

module.exports = router;
