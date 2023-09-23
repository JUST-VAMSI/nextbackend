const mongoose = require("mongoose");

const AddNewProfile = mongoose.Schema({
    name:{
        type:String,
        required:true,
        notnull:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        notnull:true
    },
    phno:{
        type:Number,
        required:true,
        notnull:true
    }
})
const addnew=mongoose.model('addprofile',AddNewProfile);
module.exports = addnew;