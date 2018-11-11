var express = require('express');
var router = express.Router();
var admin = require('../middleware/firebase')
var auth = require('../middleware/auth')
var db = admin.database()


/* GET home page. */
router.get('/', auth.sessionChecker, function(req, res, next) {
  res.render("dashboard")
});

router.post('/login', (req,res,next) => {
  var username = req.body.username
  var password = req.body.password
  var user = db.ref('users/'+username)
  user.once("value").then((snap) => {
    if(snap.val().password == password){
      console.log("Successfully logged in")
      req.session.user = username;
      res.redirect("/")
    }
    else{
      console.log("Incorrect password");      
      res.redirect("/")
    }
  })
  .catch((err) => {
    console.log("error :\n"+err);
    res.redirect("/")
   
  })
}) 

router.get('/logout', (req, res) => {
  if (req.session.user && req.cookies.user_sid) {
      res.clearCookie('user_sid');
      console.log("Successfully logged out")
      res.redirect('/')
  } else {
      res.redirect('/');
  }
});

module.exports = router;
