const {express} = require('../../Provider')

const {
  handleEmailLogin,
  handleMobileLogin,
  handleSignup,
  handleLogout,
  handleGoogleLogin,
} = require("../controllers/authController");
const {handleForgotPassword, handleResetPassword} = require('../controllers/forgotController'); 

const router = express.Router();

router.post("/email/login", handleEmailLogin);
router.post("/mobile/login", handleMobileLogin);
router.post("/google", handleGoogleLogin);
router.post("/signup", handleSignup);
router.post("/logout", handleLogout);
router.post('/forget-password', handleForgotPassword);
router.post('/reset-password', handleResetPassword);

module.exports = router;
