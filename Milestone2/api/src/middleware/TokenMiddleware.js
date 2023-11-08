const jwt = require('jsonwebtoken');

const TOKEN_COOKIE_NAME = "TimestampToken";
require('dotenv').config();

exports.TokenMiddleware = (req, res, next) => {
  // We will look for the token in two places:
  // 1. A cookie in case of a browser
  // 2. The Authorization header in case of a different client
  let token = null;
  if(!req.cookies[TOKEN_COOKIE_NAME]) {
    //No cookie, so let's check Authorization header
    const authHeader = req.get('Authorization');
    if(authHeader && authHeader.startsWith("Bearer ")) {
      //Format should be "Bearer token" but we only need the token
      token = authHeader.split(" ")[1];
    }
  }
  else { //We do have a cookie with a token
    token = req.cookies[TOKEN_COOKIE_NAME]; //Get session Id from cookie
  }

  if(!token) { // If we don't have a token
    res.status(401).json({error: 'Not authenticated'});
    return;
  }

  //If we've made it this far, we have a token. We need to validate it

  try {
    const decoded = jwt.verify(token, process.env.API_SECRET_KEY);
    req.user = decoded.user;
    next(); //Make sure we call the next middleware
  }
  catch(err) { //Token is invalid
    res.status(401).json({error: 'Not authenticated'});
    return;
  }


}


exports.generateToken = (req, res, user) => {
  console.log("LET US CREATE A TEMP USER");
  let temp = {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    username: user.username,
    avatar: user.avatar,
    role: user.role,
    affiliation: user.affiliation,
    hourly_rate: user.hourly_rate,
  };
  console.log("LET US CREATE THE COOKIE")
  let data = {
    user: temp,
    // Use the exp registered claim to expire token in 1 hour
    exp: Math.floor(Date.now() / 1000) + (60 * 60)
  }
  console.log("WE ARE COOKING");
  console.log("THIS IS THE SECRET", process.env.API_SECRET_KEY);
  const token = jwt.sign(data, process.env.API_SECRET_KEY);
  console.log("WE ARE SENDING TOKEN");
  //send token in cookie to client
  res.cookie(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    maxAge: 5 * 60 * 1000 //This session expires in 5 minutes.. but token expires in 1 hour!
  });
};


exports.removeToken = (req, res) => {
  //send session ID in cookie to client
  res.cookie(TOKEN_COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    maxAge: -360000 //A date in the past
  });

}

