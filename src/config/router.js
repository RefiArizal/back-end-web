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
  
  
  // -------- OPERASI
  router.use(
    "/v" + process.env.APP_VERSION + "/vehicle",
    // authMiddleware.jwtAuth,
    require("../router/vehicle")
  );




//--------tracking

router.use(
  "/track-location",
  authMiddleware.jwtAuth,
  require("../router/tracking/trackg20")
);
module.exports = router;
