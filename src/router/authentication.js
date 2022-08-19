const Authentication = require("../controller/authentication");
const { body } = require("express-validator");
const router = require("express").Router();
const formValidation = require("../middleware/form_validation");
const authMiddleware = require("../middleware/authentication");
router.post(
  "/login",
  body("username").notEmpty().isLength({ min: 3 }),
  body("password").notEmpty().isLength({ min: 3 }),
  formValidation,
  Authentication.login
);
router.post(
  "/login-mobile",
  body("team").notEmpty().isLength({ min: 3 }),
  body("password").notEmpty().isLength({ min: 3 }),
  body("nrp_user").notEmpty().isLength({ min: 8 }),
  formValidation,
  Authentication.loginMobile
);
router.post("/validate_login", Authentication.validateLogin);
module.exports = router;
