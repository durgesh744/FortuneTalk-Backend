const express = require('express');
const router = express.Router();

//routes`
const User = require("./user.route")
const Astrologer = require("./astrologer/astrologer.route");

const defaultRoutes = [

  // -------------------- with out token user ---------------
  {
    path: "/user",
    route: User
  },
  {
    path: "/astrologer",
    route: Astrologer
  },
]

// const authRoutes = [
//   {
//     path: "/chat",
//     route: Chat
//   },
// ];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// Auth routes
// router.use(require("../../middleware/Api-auth.middleware").auth())

// authRoutes.forEach((route) => {
//   router.use(route.path, route.route);
// });

module.exports = router;
