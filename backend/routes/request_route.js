const express = require("express");
const requestController = require("../controllers/requests_controller");

const router = express.Router();

router.post("/getRequests", requestController.sendRequests);
router.post("/getPending", requestController.sendPending);
router.post("/createRequest", requestController.createRequest);
router.post("/updateStatus", requestController.updateStatus);
router.post("/executeReuqests", requestController.executeRequests);

module.exports = router;
