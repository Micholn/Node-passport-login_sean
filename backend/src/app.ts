import server from './server';
require("dotenv").config();

const port = parseInt(process.env.PORT || '8000')

const starter = new server().start










const LocalStrategy = require("passport-local").Strategy//the local version that allows us to login
const bcrypt = require("bcrypt"); //for hashing

/**initialize passport and pass it to our different functions */
function initialize(passport, getUserByEmail, getUserById) {
  /**the parameters we're authenticating are: email, password and the done function is going 
   * to be called when we're done authenticating our user*/
  const authenticateUser = async (email, password, done) => {
      const user = getUserByEmail(email)
      if (user == null) {
        return done(null, false, { message: "No user with that email"});
      }  

/**here we're checking the password the user sent from the login form and comparing to the 
 * user.password, if it returns true then we have an authenticated user (comparing this user 
 * to the password that's passed in the password for authenticateUser) */
      try { 
        if (await bcrypt.compare(password, user.password)) {
            return done(null, user);//this is the user they are logged in as 
        } else {
            return done(null, false, { message: "password incorrect"})
        }
      } catch (e) {
        return done(e)
      }
  }



//to use the local strategy, what
  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser));
/* passport for serializing our user to store inside the session and another for vice versa 
done and user here are both functions*/
  passport.serializeUser((user, done) => (null, user.id))
  passport.deserializeUser((id, done) => {  
    return done(null, getUserById(id))
   })

}

module.exports = initialize; //exporting the function so that it can be useable