const express = require('express');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const user = require('../models/user.js');
const { saveRedirectUrl } = require('../middleware');
const router = express.Router();
const userController = require("../controllers/users")

router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post( wrapAsync (userController.userSignUp ) );
   
router
 .route("/login")
  .get( userController.renderLoginForm)
  .post(saveRedirectUrl,passport.authenticate ("local",{failureRedirect: '/login', failureFlash: true}) , userController.login);


router.get("/logout", userController.userLogout);





module.exports = router;