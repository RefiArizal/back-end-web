const router = require("express").Router();
const { body } = require("express-validator");
const CheckDataController = require("../controller/checkData");
const ReportLoginController = require("../controller/reportLogin");
// const ReportController = require("../controller/report");

const formValidation = require("../middleware/form_validation");
// router.get("/", ReportLoginController.get);

router.post("/login", ReportLoginController.login);

router.post("/logout", ReportLoginController.logout);
router.post("/:id", ReportLoginController.edit);

router.get("/check", CheckDataController.check);
module.exports = router;
