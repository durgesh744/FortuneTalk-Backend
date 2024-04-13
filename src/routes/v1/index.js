const express = require('express');
const router = express.Router();

//routes
const Auth = require("./auth.route")

const defaultRoutes = [

  // -------------------- user ---------------
  {
    path: "/auth",
    route: Auth
  },
]

const authRoutes = [
  {
    path: "/auth",
    route: Auth
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// //Auth routes
router.use(require("../../middleware/Api-auth.middleware").auth())

authRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
