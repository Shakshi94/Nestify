const express = require('express');
const router = express.Router();
const wrapAsync = require('../utlis/wrapAsyn.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const userController = require('../controllers/user.js');


router.route('/chat')
      .post(wrapAsync(userController.Chatbot));

router.route('/signup')
      .get(userController.renderSignupForm)
      .post(wrapAsync(userController.signUp));

router.route('/login')
      .get(userController.renderLoginForm) 
      .post(saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login',failureFlash:true}),userController.loggedIn)

router.get('/logout',userController.logout);

module.exports = router ;