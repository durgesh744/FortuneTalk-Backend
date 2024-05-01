const express = require('express');
const router = express.Router();

//routes`
const User = require("./user.route")
const webUser = require("./web/user.route")
const Astrologer = require("./astrologer/astrologer.route");

// -------------------- with out token access routes ---------------
const defaultRoutes = [

  {
    path: "/webUser",
    route: webUser
  },
  {
    path: "/user",
    route: User
  },
  {
    path: "/astrologer",
    route: Astrologer
  },
]

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// --------------------access routes with token ---------------
const authRoutes = [
  // {
  //   path: "/path",
  //   route: Route Name
  // },
];

// Auth routes
router.use(require("../../middleware/Api-auth.middleware").auth())

authRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
