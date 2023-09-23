const mongoose = require("mongoose");

const SignUp = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        notnull:true
    },
    password:{
        type:String,
        required:true,
        notnull:true
    }

})
const signup = mongoose.model("registrations",SignUp);
module.exports = signup;