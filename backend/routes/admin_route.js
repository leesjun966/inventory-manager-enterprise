const express = require("express");
const adminController = require("../controllers/admin_controller");

const router = express.Router();

router.post("/getUsers", adminController.sendUsers);
router.post("/getUser", adminController.sendUser);
router.post("/addUser", adminController.addUser);
router.post("/removeUser", adminController.removeUsers);
router.post("/editUser", adminController.editUser);
router.post("/generateQR", adminController.generateQR);
router.post("/resetQR", adminController.resetQR);

module.exports = router;
