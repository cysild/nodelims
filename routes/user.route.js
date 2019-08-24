const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const Joi = require('joi');
const { User, validate } = require("../models/user.model");

const { Sample } = require("../models/sample.model");



const express = require("express");
const router = express.Router();

router.get("/current", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});



router.get("/find", auth, async (req, res) => {
 // const user = await User.findById(req.user._id).select("-password");

if(req.body.email){

}

  var user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send("Not found");
    try {
    //if can verify the token, set req.user and pass to next middleware
   //  console.log();
  res.send(user);
  } catch (ex) {
    //if invalid token
       res.send(ex);
  }

  // if(user.length > 0){
  //   res.send(user);
  // }
  res.send("no results found");
});
router.get("/all", auth, async (req, res) => {
 // const user = await User.findById(req.user._id).select("-password");



  var user = await User.find({});

  if (!user) return res.status(400).send("Not found");
    try {
    //if can verify the token, set req.user and pass to next middleware
   //  console.log();
  res.send(user);
  } catch (ex) {
    //if invalid token
       res.send(ex);
  }

  // if(user.length > 0){
  //   res.send(user);
  // }
  res.send("no results found");
});

router.post("/", async (req, res) => {
  // validate the request body first
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //find an existing user
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User({
    name: req.body.name,
    password: req.body.password,
    email: req.body.email,
    institution: req.body.institution,
    phone: req.body.phone,
        type: req.body.type

  });
  user.password = await bcrypt.hash(user.password, 10);
  await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send({
    _id: user._id,
    name: user.name,
    email: user.email,
    token:token,
  });
});

router.post("/login", async (req, res) => {
  // validate the request body first

  function validateUserLogin(user) {
  const schema = {
    email: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(5).max(255).required(),
  };

  return Joi.validate(req.body,schema);
}
  const { error } = validateUserLogin(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //find an existing user
  let user = await User.findOne({ email: req.body.email });

   

  if(user){

          
           const match = await bcrypt.compare(req.body.password, user.password);

          if(match){
              const token = user.generateAuthToken();
        res.header("x-auth-token", token).send({
    _id: user._id,
    name: user.name,
    email: user.email,
    institution:user.institution,
    phone:user.phone,
    token:token,
         });

          }else
          {
     res.status(400).send("password incoorect");

          }

  }
  else{
   res.status(400).send("user incoorect");

      }
  

  // user = new User({
  //   name: req.body.name,
  //   password: req.body.password,
  //   email: req.body.email,
  //   institution: req.body.institution,
  //   phone: req.body.phone,
  //       type: req.body.type

  // });
  // user.password = await bcrypt.hash(user.password, 10);
  // await user.save();




  // const token = user.generateAuthToken();
  // res.header("x-auth-token", token).send({
  //   _id: user._id,
  //   name: user.name,
  //   email: user.email,
  //   token:token,
  // });
});

router.post("/sample", async (req, res) => {

  sample = new Sample(req.body);

  await sample.save();

  const token = '123';
  res.header("x-auth-token", token).send({
    _id: sample._id,
  
  });
});

// router.put("/sample/:id", async (req, res) => {

//   sample =  Sample.update({'_id':req.params.id}, {$set: req.body});

//  // console.log(sample);

//   // const token = '123';
//   // res.header("x-auth-token", token).send({
//   //   _id: sample._id,
  
//   // });
// });

router.put("/sample/:id", async (req, res) => {


 await Sample.findByIdAndUpdate({_id: req.params.id},
                     req.body, function(err, docs){
        if(err) res.json(err);
        else
        { 
       //    console.log(docs);
         //  res.redirect('/user/'+req.params.id);

           res.send(docs);


         }
       });
});



// router.get("/sample" , auth, async (req, res) => {
//  //const user = await User.findById(req.user._id).select("-password");
//   res.send(req.user._id);

// });


router.get("/sample" , auth , async (req, res) => {
 const user = await User.findOne({'_id':req.user._id}).select("-password");



 const sample = await Sample.find({'UserID':req.user._id});

//const sample = await Sample.aggregate.lookup([{ from: 'users', localField: 'UserId', foreignField: '_id', as: 'users' }])
//console.log(user);
var x= [];
 sample.forEach(function(item) { 
     x.push({'id':item._id,'name':user.name,'email':user.email,'institution':user.institution,'sampletype':item.SampleType,'phone':user.phone,'examplarstatus':"Not Pushed","review":"No"});
//console.log(user.name);
  });

 //  Sample.aggregate([
 //    { $lookup:
 //       {
 //         from: 'users',
 //         localField: '_id',
 //         foreignField: 'user_id',
 //         as: 'usersa'
 //       }
 //     }
 //    ]).exec(function(err, results){
 //    console.log(results);
 // });





  res.json(x);

});



router.get("/sample" , auth , async (req, res) => {
 const user = await User.findOne({'_id':req.user._id}).select("-password");



 const sample = await Sample.find({'UserID':req.user._id});

var x= [];
 sample.forEach(function(item) { 
     x.push({'id':item._id,'name':user.name,'email':user.email,'institution':user.institution,'sampletype':item.SampleType,'examplarstatus':"no","review":"no"});

  });

  res.json(x);

});

router.put("/sample/child" , auth, async (req, res) => {

   const count = await Sample.count({'_id':req.params.SampleId});
if(count > 0){
    await Sample.findByIdAndUpdate({_id: req.params.id},
                     req.body, function(err, docs){
        if(err) res.json(err);
        else
        { 
       //    console.log(docs);
         //  res.redirect('/user/'+req.params.id);

           res.send(docs);


         }
       });
}

 else{
  //res.json
 } 



});


router.get("/sample/:id" , auth, async (req, res) => {
 const user = await Sample.findOne({'_id':req.params.id}).select("-Sample");

   res.json(user);
 });
module.exports = router;
