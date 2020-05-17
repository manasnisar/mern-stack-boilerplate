const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        maxlength:50
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        minlength:5
    },
    role:{
        type:Number,
        default:0
    },
    token:{
        type:String
    },
    tokenExp:{
        type:Number
    }
});

UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) 
    {
        bcrypt.genSalt(saltRounds, function (err, salt) 
        {       
            if (err) 
            {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } 
    else 
    {
        return next();
    }
});

UserSchema.methods.comparePassword = function(plainPassword,cb){
    bcrypt.compare(plainPassword,this.password, function(err,isMatch){
        if(err) return cb(err);
        cb(null,isMatch)
    })
}

UserSchema.methods.generateToken = function(cb){
    var user = this;
    var token = jwt.sign(user._id.toHexString(),'secret')

    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null,user);
    })
}

UserSchema.statics.findByToken = function(token, cb){
    var user = this;

    jwt.verify(token,'secret', function(err,decode){
        user.findOne({'_id':decode, 'token':token} , function(err,user){
            if(err) return cb(err);
            cb(null,user);
        })
    })
}

const User = mongoose.model('User',UserSchema); 

module.exports = User;