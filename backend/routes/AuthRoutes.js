const router = require("express").Router();
const { registerUser, loginUser, logoutUser,checkIfLoggedIn } = require("../controllers/AuthControllers");
const {checkUser} =require("../middleware/AuhtMW")


router.post("/api/login", loginUser);
router.post("/api/register", registerUser);
router.post("/api/dashboard",checkUser);
router.post("/api/logout",logoutUser);
router.post("/api/auth",checkIfLoggedIn)
module.exports = router;
