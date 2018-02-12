var mongoose=require("mongoose");

var googleUser=mongoose.model("passportGmail",{
    id:String,
    token:String,
    email:String,
    name:String
});

module.exports={googleUser};