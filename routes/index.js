var express = require('express');
var router = express.Router();
var admin = require('../middleware/firebase')
var auth = require('../middleware/auth')
var db = admin.database()


/* GET home page. */
router.get('/', auth.sessionChecker, function(req, res, next) {
  res.render("dashboard")
  console.log(req.session.user)
    
});

router.post('/login', (req,res,next) => {
  var username = req.body.username
  var password = req.body.password
  var user = db.ref('users/'+username)
  user.once("value").then((snap) => {
    if(snap.val().password == password){
      console.log("Successfully logged in")
      req.session.user = username;
      //console.log("hello"+req.session.user)  
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

router.get('/challenge/:cid',auth.sessionChecker,function(req,res){

  cid = req.params.cid;
  //console.log(cid);
  var challenge = db.ref('Challenges/'+cid)
  challenge.on("value",function(snapshot){
    console.log(snapshot.val().done);
    if(snapshot.val().done == 0){
      res.render("question")
    }
    else{
      res.render("completed")
    }
  },function(err){
    console.log("Error: "+err);
  })
  //res.send("qwerty")

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
