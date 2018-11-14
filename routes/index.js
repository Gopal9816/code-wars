var express = require('express');
var router = express.Router();
var admin = require('../middleware/firebase')
var auth = require('../middleware/auth')
var db = admin.database() 
const axios = require('axios')

var langIdArr = {
  "C":8,
  "C++":13,
  "Python": 61,
  "Python 3": 63
}

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
      userinfo = {
        uname:username
      }
      req.session.user = userinfo;
      console.log("hello "+req.session.user.uname)  
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
}

) 
router.get('/challenge/:cid',auth.sessionChecker,function(req,res){

  cid = req.params.cid;
  //console.log(cid);
  var challenge = db.ref('Challenges/'+cid)
  challenge.once("value",function(snapshot){
    console.log(snapshot.val());
    if(snapshot.val().done == 0){
      level={
        username:req.session.user.uname,
        question:snapshot.val().question,
        cid:cid
      }
      console.log(level);
      res.render("question",{ level:level })
    }
    else{
      res.render("completed")
    }
  },function(err){
    console.log("Error: "+err.response);
  })


})

router.post('/answer/:cid',(req,res)=>{
  
  console.log("CHECK ANSWER")
  console.log(req.body.code)
  cid=req.params.cid; 
  var codeLang = req.body.lang

  axios.post('http://cloudcompiler.esy.es/api/submissions/',{
    sourceCode: req.body.code,
    langId: langIdArr[codeLang]
  },
  {
    headers: {
        'Content-Type': 'application/json'
    }
})
  .then((res) => {
    console.log(res.data)
  })
  .catch((err) => {
    console.log("Error\n"+err)
  })
  // Part to check correct answer

  //to update answers
  // var ans = db.ref('Challenges/'+cid)
  // ans.update({
  //   done:1,
  //   doneby:req.session.user.uname
  // })
   res.redirect('/');
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

<<<<<<< HEAD
<<<<<<< HEAD

=======
router.get('/editor',(req,res,next) => {
  res.render('editor')
})
>>>>>>> Some changes
=======
router.get('/editor',(req,res,next) => {
  res.render('editor')
})

>>>>>>> Added code editor

module.exports = router;
