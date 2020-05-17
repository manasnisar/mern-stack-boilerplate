const router = require('express').Router();
const User = require("../models/user");
// const jwt = require('jsonwebtoken');
const {auth} = require("../middleware/auth");


router.route('/auth').get(auth , (req,res) =>{
    res.status(200).json({
        _id:req._id,
        isAuth:true,
        email:req.user.email,
        name:req.user.name,
        role:req.user.role
    })
})


router.route('/register').post((req,res) =>{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const newUser = User({
        name,
        email,
        password
    });

    newUser.save()
    .then(() => res.json('User Added!'))
    .catch(err => res.status(400).json('Error:') + err)
});

router.route('/login').post((req,res) => {
    User.findOne({email: req.body.email} , (err,user) => {
        if(!user){
            res.json({
                loginSuccess:false,
                message: "Auth failed, email not found"
            })
        }
        user.comparePassword(req.body.password,(err, isMatch) => {
            if(err) return console.log(err);
            if(!isMatch){
                return res.json({loginSuccess:false, message:"Wrong Password"})
            }
        })
        
        user.generateToken((err, user) => {
            if(err) return res.status(400).send(err);
            res.cookie('x_auth' , user.token)
            .status(200)
            .json({
                loginSuccess:true 
            })
        })

    })
})

router.route('/logout').get(auth,(req,res) => {
    User.findOneAndUpdate({_id: req.user._id} , {token: ""} , (err, doc) => {
        if(err) return res.json({ success: false, err});
        return res.status(200).send({
            success:true
        })
    })
})

module.exports = router;