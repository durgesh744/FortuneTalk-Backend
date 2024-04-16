const express = require('express');
const router = express.Router();

//routes`
const Auth = require("./auth.route")
const Chat = require("./chat.route")

const defaultRoutes = [

  // -------------------- with out token user ---------------
  {
    path: "/auth",
    route: Auth
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
