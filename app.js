require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose=require("mongoose");
const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
const { deserializeUser } = require('passport');
// const GoogleStrategy=require("passport-google-oauth20").Strategy;
const findOrCreate=require("mongoose-findorcreate");
const app = express();


app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://Abhay:test@cluster0.xre5kjo.mongodb.net/AniuserDB");

const aniuserSchema=new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    googleId: String,
});

aniuserSchema.plugin(passportLocalMongoose);
aniuserSchema.plugin(findOrCreate);

const Aniuser=new mongoose.model("Aniuser",aniuserSchema);

var isLoggedin=0;

passport.use(Aniuser.createStrategy());

passport.serializeUser(Aniuser.serializeUser());
passport.deserializeUser(Aniuser.deserializeUser());

// passport.use(new GoogleStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL:"http://localhost:3000/auth/google/Anifinity",
//     userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
//     },
//     function(accessToken,refreshToken,profile,cb){
//       Aniuser.findOrCreate({googleId: profile.id},function(err,user){
//         return cb(err,user);
//       });
//     }
//   ));

app.get("/",function(req,res){
    if(!isLoggedin)
    res.render("home",{logValue: "Login",logstat:0});
    else
    {
        if(req.isAuthenticated()||isLoggedin)
        {
            res.render("home",{logValue: "Logout",logstat:1});
        }
        else
        {
            res.redirect("/login");
        }
    }
});
// app.get("/auth/google",
//   passport.authenticate("google",{scope: ["profile"]})
// );

// app.get("/auth/google/Anifinity",
//   passport.authenticate("google",{failureRedirect: "/login"}),
//   function(req,res){
//     isLoggedin=1;
//     res.redirect("/Anifinity");
// });
app.get("/login",function(req,res){
    res.render("login",{title: req.params.title});  
});
app.get("/register",function(req,res){
    res.render("register",{title: req.params.title, errStat:""});
});
app.get("/detail",function(req,res){
    res.render("detail",{title: req.params.title});
});
app.get("/Anifinity",function(req,res){
    Aniuser.find(function(err,foundUsers){
      if(err)
      console.log(err);
      else
      {
        if(foundUsers)
        {
            isLoggedin=1;
            res.redirect("/");
        }
      }
    });
  });
app.get("/logout",function(req,res){
    isLoggedin=0;
    req.logout(function(err){
        if(err)
        console.log(err);
        else
        res.redirect("/");
    });
});
app.post("/register",function(req,res){
    if(req.body.username=="")
    {
        res.render("register",{title: req.params.title, errStat: "Please fill the name"});
    }
    else if(req.body.email=="")
    {
        res.render("register",{title: req.params.title, errStat: "Please fill the email"});
    }
    else if(req.body.password=="")
    {
        res.render("register",{title: req.params.title, errStat: "Please fill the password"});
    }
    else if((req.body.password)!==(req.body.repassword))
    {
        res.render("register",{title: req.params.title, errStat: "Passwords don't match"});
    }
    else
    {
        Aniuser.register({username: req.body.username, name:req.body.name},req.body.password, function(err,user){
            if(err)
            {
                console.log(err);
                res.redirect("/register");
            }
            else
            {
                passport.authenticate("local")(req,res,function(){
                    isLoggedin=1;
                    res.redirect("/");
                });
            }
        });
    }
});

app.post("/login",function(req,res){
    const user = new Aniuser({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user,function(err){
        if(err)
        console.log(err);
        else
        {
            passport.authenticate("local")(req,res,function(){
                isLoggedin=1;
                res.redirect("/")
            });
        }
    });
});
let port = process.env.PORT;
if(port == null || port=="")
{
    port=3000;
}
app.listen(port, function() {
    console.log("Server started on port 3000");
});

// https://morning-savannah-04386.herokuapp.com/
