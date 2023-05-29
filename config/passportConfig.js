const passport = require("passport");
//const local = require("passport-local");
const { userModel } = require("../Dao/Mongo/models/user.model");
//const { createHash, isValidPassword } = require("../utils/bcryptHash");
const GithubStrategy = require('passport-github2')
require('dotenv').config()
//const LocalStrategy = local.Strategy;
/*
const initPassport = () => {
  // vamos a configurar el registro
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { firts_name, last_name } = req.body;
        try {
          let userDB = await userModel.findOne({ email: username });
          if (userDB) return done(null, false);

          let newUser = {
            firts_name,
            last_name,
            email: username,
            password: createHash(password),
          };
          let result = await userModel.create(newUser);
          return done(null, result);
        } catch (error) {
          console.log("error en register passport");
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userModel.findOne({ _id: id });
    done(null, user);
  });

  // y aca el login
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        const userDB = await userModel.findOne({ email: username });
        try {
          if (!userDB) return done(null, false);

          if (!isValidPassword(password, userDB)) return done(null, false);
          return done(null, userDB);
        } catch (error) {
          console.log("error en login passport");
        }
      }
    )
  );
  
};
*/
const initPassortGithub = ()=>{
  passport.use('github', new GithubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL
  }, async (accessToken, refreshToken, profile, done)=>{
      //console.log('Profile', profile)
      try {
          let user = await userModel.findOne({email: profile._json.email})
          // if(user)
          if(!user){
            let newUser= {
              first_name: profile.username,
              last_name: profile.username,
              email: profile._json.email,
              date_of_birth: profile._json.created_at,
              username: profile._json.name,
              password: ' '
          }
              let result = await userModel.create(newUser)
              return done(null, result)
          }
          return done(null, user)
      } catch (error) {
          console.log(error)
      }
  }))
  passport.serializeUser((user, done)=>{
      done(null, user._id)
  })

  passport.deserializeUser(async (id, done)=>{
      let user = await userModel.findOne({_id:id})
      done(null, user)
  })

}

module.exports = {
  //initPassport,
  initPassortGithub
};
