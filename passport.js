const passport = require('passport');
const db = require('./database')
const jwt = require('jsonwebtoken');
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// Passport Strategies


// Username + Password Authentication
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    db.verifyUser(username, password, (err, res) => {
      return done (null, res)
    })
  }
));

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey   : process.env.secret
},
function (jwtPayload, cb) {

  console.log('jwtpayload', jwtPayload._id)

  return cb(null, jwtPayload)
  //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
  // return db.findUserById(jwtPayload._id, (usr) => {
  //   console.log('jwt', usr)
  //   return cb(null, usr)
  // })
}
));


passport.serializeUser(function(user, cb) {
  cb(null, user._id);
});

passport.deserializeUser(function(id, done) {

  db.findUserById( id, (err, usr) => {
    done(null, usr)
  } )

});

exports.passport = passport