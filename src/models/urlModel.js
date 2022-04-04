const mongoose = require("mongoose")


const urlSchema = new mongoose.Schema({
    longUrl : {
        type : String,
        required:true,
        trim:true
    },

    shortUrl:{
        type : String,
        unique:true,
        trim:true,
        required:[true, "shortUrl required"]
    }, 

    urlCode :{
        type : String,
        unique:true,
        required:[true, "url code required"]
    

    }
}  , {timestamps:true})

module.exports=mongoose.model("urlShortner", urlSchema )