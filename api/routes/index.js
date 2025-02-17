const {express} = require('../../Provider') 
const {router} = require('../../Provider')
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");

router.use("/auth", authRoutes); // route for all authentication
router.use("/users", userRoutes); 


module.exports = router;
