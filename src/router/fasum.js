const router = require("express").Router();
const { body } = require("express-validator");
const FasumController = require("../controller/fasum");
const formValidation = require("../middleware/form_validation");
router.get("/", FasumController.get);
router.get("/getId/:id", FasumController.getId);
router.post(
  "/add",
  body("name_fasum").notEmpty().isLength({ min: 3 }),
  formValidation,
  FasumController.add
);
router.post("/import", formValidation, FasumController.importExcell);
router.put("/edit/:id", FasumController.edit);
router.delete(
  "/delete",
  body("id").notEmpty().isLength({ min: 1 }),
  formValidation,
  FasumController.delete
);

module.exports = router;