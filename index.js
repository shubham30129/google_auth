var express = require("express");
var bodyparser = require("body-parser");



var app = express();
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended:true }));

var {mongoose}=require("./db/config");
var {User}=require("./models/user");
var {googleUser}=require("./models/google");
// step 1
var passport = require("passport");
//var LocalStrategy = require("passport-local").Strategy;
var GoogleStrategy=require('passport-google-oauth').OAuth2Strategy;
var configAuth=require("./db/auth");

// step 2
app.use(passport.initialize());

// step 3
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(`Access-Control-Allow-Methods`, `POST`);
    res.header(`Access-Control-Expose-Headers`, `x-auth`);
    next();
});

// step 4
passport.serializeUser((user,done)=>{
    console.log('serialize');
    done(null,user);
});
passport.deserializeUser((user,done)=>{
    console.log('deserialize');
    done(null,user);
});

// step 5
/*
var user=mongoose.model('passportGmail',{
    id:String,
    token:String,
    email:String,
    name:String
});*/
// step 6
passport.use("google",new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL
    },
    // google will send back the token and profile
    (accessToken, refreshToken, profile, done)=> {
        // asynchronous // Event Loop
        console.log(profile);


        //find the user in the database based on their facebook id

        googleUser.findOne({ 'id' : profile.id }, (err, user)=> {
            if (err) return done(err);

            // if the user is found, then log them in
            if (user) {
                return done(null, user); // user found, return that user
            } else {

                var id1=profile.id;
                var name1=profile.displayName;
                var email1=profile.emails[0].value;
                console.log(id1+"\t"+name1+"\t"+email1);
                var e=new googleUser({id:id1,name:name1,email:email1});
                e.save().then((doc)=>{


                });
            }

        });


    }));


// google ROUTES
app.get('/auth/google', passport.authenticate('google',
    { scope: ['profile','email'] }
    )
);
app.get('/auth/google/callback',passport.authenticate('google', {
    successRedirect:'/sucess',
    failureRedirect:'/fail'
    }
));

app.get("/login",(req,res)=>{
    res.render("index");
});




app.get('/sucess',(req,res)=>{
    res.send("sucess");
});

app.get('/fail',(req,res)=>{
   res.send("fail");
});
app.listen(2222);