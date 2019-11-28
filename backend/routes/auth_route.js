const express = require("express");
const authController = require("../controllers/auth_controller");

const router = express.Router();

router.post("/", authController.authenticate_user);
router.post("/app", authController.authenticate_qr);
router.post("/changePassword", authController.changePassword);

module.exports = router;
