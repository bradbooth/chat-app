const passport = require('passport');
const db = require('./database')
const passportJWT = require("passport-jwt");
const JWTStrategy   = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;


// Username + Password Authentication
const LocalStrategy = require('passport-local').Strategy;

// Extract jwt token from header
const jwtHeader = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey   : process.env.secret
}

// Extract jwt token from query parameter
const jwtQuery = {
  jwtFromRequest: ExtractJWT.fromUrlQueryParameter('token'),
  secretOrKey   : process.env.secret
}

const jwtVerify = (jwtPayload, cb) => {

  return cb(null, jwtPayload)
  //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
  // return db.findUserById(jwtPayload._id, (usr) => {
  //   console.log('jwt', usr)
  //   return cb(null, usr)
  // })
}

passport.serializeUser(function(user, cb) {
  console.log("USER:", user)
  cb(null, {
    _id: user._id,
    username: user.username
  });
});

passport.deserializeUser(function(id, done) {
  db.findUserById( id, (err, usr) => {
    done(null, usr)
  } )
});

// Validation via username and password
passport.use(new LocalStrategy(
  function(username, password, done) {
    db.verifyUser(username, password, (err, res) => {
      return done (null, res)
    })
  }
));

// Validation via authorization header
passport.use(new JWTStrategy(jwtHeader,jwtVerify));


exports.passport = passport
exports.passport.options = {
  jwtQuery,
  jwtHeader,
  jwtVerify
}