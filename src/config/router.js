const router = require("express").Router();
const authMiddleware = require("../middleware/authentication");
require("dotenv").config();
router.use(
  "/v" + process.env.APP_VERSION + "/gmaps-api",
  authMiddleware.jwtAuth,
  require("../router/google_maps_api")
);
router.use(
  "/v" + process.env.APP_VERSION + "/user-role",
  authMiddleware.jwtAuth,
  require("../router/user_role")
);
router.use(
  "/v" + process.env.APP_VERSION + "/auth",
  require("../router/authentication")
);
router.use(
  "/v" + process.env.APP_VERSION + "/user",
  authMiddleware.jwtAuth,
  require("../router/user")
);

router.use(
  "/v" + process.env.APP_VERSION + "/track-notif",
  authMiddleware.jwtAuth,
  require("../router/token_track_notif")
);

//test
// -------- OPERASI
router.use(
  "/v" + process.env.APP_VERSION + "/vehicle",
  authMiddleware.jwtAuth,
  require("../router/vehicle")
);
router.use(
  "/v" + process.env.APP_VERSION + "/officer",
  authMiddleware.jwtAuth,
  require("../router/officer")
);
router.use(
  "/v" + process.env.APP_VERSION + "/vip",
  authMiddleware.jwtAuth,
  require("../router/vip")
);

router.use(
  "/v" + process.env.APP_VERSION + "/schedule",
  authMiddleware.jwtAuth,
  require("../router/schedule")
);

// CCTV
router.use(
  "/v" + process.env.APP_VERSION + "/cctv",
  authMiddleware.jwtAuth,
  require("../router/cctv")
);

// FASUM
router.use(
  "/v" + process.env.APP_VERSION + "/category_fasum",
  authMiddleware.jwtAuth,
  require("../router/category_fasum")
);
router.use(
  "/v" + process.env.APP_VERSION + "/fasum",
  authMiddleware.jwtAuth,
  require("../router/fasum")
);

//--------tracking

router.use(
  "/track-location",
  authMiddleware.jwtAuth,
  require("../router/tracking/trackg20")
);

// -------- polda
router.use(
  "/v" + process.env.APP_VERSION + "/polda",
  authMiddleware.jwtAuth,
  require("../router/polda")
);
router.use(
  "/v" + process.env.APP_VERSION + "/polres",
  authMiddleware.jwtAuth,
  require("../router/polres")
);

router.use(
  "/v" + process.env.APP_VERSION + "/account",
  authMiddleware.jwtAuth,
  require("../router/account")
);
//---------- trx account profile
router.use(
  "/v" + process.env.APP_VERSION + "/account-officer",
  authMiddleware.jwtAuth,
  require("../router/trx_account_officer")
);
// --------- operation profile
router.use(
  "/v" + process.env.APP_VERSION + "/operation-profile",
  authMiddleware.jwtAuth,
  require("../router/operation_profile")
);
// --------- operation profile polda
router.use(
  "/v" + process.env.APP_VERSION + "/operation-profile-polda",
  authMiddleware.jwtAuth,
  require("../router/trx_operation_profile_polda")
);
router.use(
  "/v" + process.env.APP_VERSION + "/operation-profile-polres",
  authMiddleware.jwtAuth,
  require("../router/trx_operation_profile_polres")
);

router.use(
  "/v" + process.env.APP_VERSION + "/renpam",
  authMiddleware.jwtAuth,
  require("../router/renpam")
);
router.use(
  "/v" + process.env.APP_VERSION + "/renpam-account",
  authMiddleware.jwtAuth,
  require("../router/renpam_account")
);
router.use(
  "/v" + process.env.APP_VERSION + "/renpam-vip",
  authMiddleware.jwtAuth,
  require("../router/renpam_vip")
);
router.use(
  "/v" + process.env.APP_VERSION + "/filter-search",
  authMiddleware.jwtAuth,
  require("../router/filterSearch")
);
router.use(
  "/v" + process.env.APP_VERSION + "/panic-button",
  authMiddleware.jwtAuth,
  require("../router/panicButton")
);
router.use(
  "/v" + process.env.APP_VERSION + "/report",
  authMiddleware.jwtAuth,
  require("../router/report")
);

module.exports = router;
