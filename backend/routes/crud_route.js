const express = require("express");
const crudController = require("../controllers/crud_controller");

const router = express.Router();

router.post("/getInventory", crudController.sendInventory);
router.post("/getTable", crudController.sendTable);
router.post("/getSpecific", crudController.sendSpecific);
router.post("/getRow", crudController.sendRow);
router.post("/getMaterialQR", crudController.generateMaterialQR);
router.post("/createCategory", crudController.createCategory);
router.post("/editItem", crudController.editItem);
router.post("/insertItem", crudController.insertItem);
router.post("/toProduction", crudController.toProduction);
router.post("/toExternal", crudController.toExternal);
router.post("/toWarehouse", crudController.toWarehouse);
router.post("/getFlow", crudController.sendFlow);

module.exports = router;
