var mongoose=require("mongoose");

var User=mongoose.model("user",{
    uname:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
});

module.exports={User};