const {express} = require('../../Provider')
const { verifyAuthMiddleware } = require("../middlewares/verfiyAuthMIddleware");
const { handleGetProfile } = require("../controllers/userController");
const {router} = require('../../Provider')

router.get("/profile", verifyAuthMiddleware, handleGetProfile);

module.exports = router;
