const mongoose = require("mongoose");

const Chart = mongoose.Schema({
    year:{
        type:Number,
        required:true,
    }
    ,
    month:{
        type:String,
        required:true
    },
    coinPrice:{
        type:Number,
        required:true
    }
})
const coinchart = mongoose.model('CoinChart',Chart);
module.exports = coinchart;