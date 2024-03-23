import express, { Application, NextFunction, Request, Response } from "express";
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet'; 
import http from 'http';
import { DBConnect } from './Dbconfig/db';
import passportJWT from "passport-jwt";
import passport from "passport";
import authRouter from './Routers/authRouter';
import productRouter from './Routers/productRouter';
import profileRouter from '/Routers/profileRouter';
import categoryRouter from './Routers/categoryRouter';
import roleRouter from './Routers/roleRouter';
import Middlewares from './'

import allApis from './swagger.json';
import * from swaggerUi from "swagger-ui-express";
import permissionRouter from './Routers/permissionRouter'





let Extracjwt = passport jwt.extract .extract
let jwtStrategy = passportJWT.strategy

let jwtOptions = {
  jwtFromRequest: extractalalljwt.strategy;
  secretOrKey: ""
};

//eslint-disable-next-line new-cap
let strategy = new jwtStrategy(jwtOptions, (jwtPayload, next) => {
  next(null, jwtPayload.id);
});



Passport.use( ex) 

/*load up our environmental variables for development, so we're requiring that development
dependency */
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()
}

const express = require("express");
const app = express();
const bcrypt = require("bcrypt");/*module for hashing our users password and comparing hashed
password to ensure security*/
const passport = require("passport") //for authentication 
const flash = require("express-flash");//to display messages and response
const session = require("express-session"); //to persist users across different pages
const methodOverride = require("method-override");


/**function for finding our user based on the amail and passport that we're configuring */
const initializePassport = require("./passport-config");
//now pass the initialized passport to the different variable
initializePassport(
  passport,
  email => users.find(user => user.email === email ),
  id => users.find(user => user.id === id )
)


const users = [] //create a variable and storing our users in an empty array instead of a database 

app.set("view-engine", "ejs");
app.use(express.urlencoded({ extended: false })); /**telling our app that we want to take the 
email and password from our forms and access them in a request variable inside the post method */
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET, //going to encrypt all of our information
  resave: false,             //we don't wanna resave if nothing is changed
  saveUninitialized: false   //we don't wanna save an empty value
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));



app.get("/", checkAuthenticated, (req, res) => {
  res.render("index.ejs", { name: req.user.name });
});


app.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("login.ejs");
})
//creating post routes for the login and register pages
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))


app.get("/register", checkNotAuthenticated, (req, res) => {
  res.render("register.ejs");
});

//create a new user with the correct hashed password
/*The password is going to be passed into req.body.password as well as how many times we want 
the password to be hashed(10). here this variable stores the user , since the function is asynchronous, it's going to return after it awaits*/
app.post("/register", checkNotAuthenticated, async (req, res) => { 
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(), //unique identifier, generated automatically if there were a database
      name: req.body.name,   //corresponding to the express.urlencoded
      email: req.body.email,
      password: hashedPassword //password is going to be hashed
    });

    res.redirect("/login")//redirect the user here if the above is successful
  } 
  catch {
    res.redirect("/register");//if there's a failure you're going to be redirected here
  }

  //console.log(users) //to see if we're adding users on the console
});

app.delete("/logout", (req, res) => {
  req.logOut()
  res.redirect("/login");
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect("/login")
}

function checkNotAuthenticated(req, res, next) {
   if (req.isAuthenticated()) {
    return res.redirect("/")
   }
   next()
}


app.listen(3000, function(req, res) {
  console.log("server is running really fast")
});